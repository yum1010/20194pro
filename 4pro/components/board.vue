<template>
<svg width="800" height="800">
  <tile v-for="(t,i) in tiling"
	:id="i" :onoff="onoff[i]" :guided="guided[i]" :points="t"
	@toggle="toggle"
	></tile>
  <ansbutton @solve="solve"></ansbutton>
</svg>
</template>

<script>
import ansbutton from '~/components/ansbutton.vue'
import tile from '~/components/tile.vue'

export default{
    components:{
	ansbutton,
	tile
    },
    props: ['N'],
    data(){
	return{
	    onoff:[],//ボードの状態
	    guided:[],//答え
	    rhombi:null
	}
    },
    created(){//一回だけ
	this.onoff=[];
	this.guided=[];
	    for(let t in this.tiling){
		this.onoff.push(1);
		this.guided.push(false);
	    }
    },
    watch:{//Nが書き換わったとき
	N: function(){
	    this.onoff=[];
	    this.guided=[];
	    for(let t in this.tiling){
		this.onoff.push(1);
		this.guided.push(false);
	    }
	}
    },
    methods:{
	toggle: function(i){
	    // console.log(i);
	    this.onoff.splice(i,1,1-this.onoff[i]);//i番目を1つだけ1なら0に0なら1に
	    for(let j of this.adjacentList[i]){//隣接するひし形を一つ取り出して
		this.onoff.splice(j,1,1-this.onoff[j]);//隣接するひし形反転
	    }
	    this.guided.splice(i,1,false);
	},
	isAdjacent: function(r,s){//二つのひし形r,sが隣接しているか
	    let count=0;
	    for(let v of r){
		for(let w of s){
		    if(v==w){
			count++;
		    }
		}
	    }
	    if(count==2){
		return true;
	    }else{
		return false;
	    }
	},
	solve: function(){
	    let A= [];//スイッチ行列(押すことで反転する場所)
	    for(let i in this.rhombi){
		A.push([]);
		for(let j in this.rhombi){
		    A[i].push(0);
		}
	    }
	    for(let i in this.rhombi){
		A[i][i]=1;//自分自身も反転
		for(let j in this.rhombi){
		    if(this.isAdjacent(this.rhombi[i],this.rhombi[j])){//ひし形iとjが隣接してるなら
			A[j][i]=1;//スイッチ行列に1を
		    }
		}
	    }
	     for(let i in this.onoff){
		A[i].push(this.onoff[i]);//現在の盤面を付け加える
	     }
	    let ans=gauss(A);
	    for(let i in this.guided){
		if(ans[i]==1){
		    this.guided.splice(i,1,true);
		}
	    }
	    console.log(gauss(A));
	}
    },
   
    computed:{
	adjacentList(){
	    let List = [];//それに隣接するひし形の添え字
	    for(let i in this.rhombi){
		let alist=[];//一つのrhombi
		//A[i][i]=1;//自分自身も反転
		for(let j in this.rhombi){
		    if(this.isAdjacent(this.rhombi[i],this.rhombi[j])){//ひし形iとjが隣接してるなら
			alist.push(j);
			//A[j][i]=1;//スイッチ行列に1を
		    }
		}
		List.push(alist);
	    }
	    return List;
	},
	tiling(){
	    let N=this.N;
	    let vertices = [[0,0,0,0,0],//中心
			    [1,0,0,0,0],//10等分したそれぞれの点を五次元座標に
			    [0,1,0,0,0],
			    [0,0,1,0,0],
			    [0,0,0,1,0],
			    [0,0,0,0,1],
			    [-1,0,0,0,0],
			    [0,-1,0,0,0],
			    [0,0,-1,0,0],
			    [0,0,0,-1,0],
			    [0,0,0,0,-1],
			   ];
	    let Atriangles=[[0,1,2],//三角形に向きをつけた
			    [0,3,2],
			    [0,3,4],
			    [0,5,4],
			    [0,5,6],
			    [0,7,6],
			    [0,7,8],
			    [0,9,8],
			    [0,9,10],
			    [0,1,10]
			   ];
	    let Btriangles = [];
	    
	    
	    function expand(x){//拡大
		return[x[1]-x[4],
		       x[0]+x[2],
		       x[1]+x[3],
		       x[2]+x[4],
		       x[3]-x[0]
		      ];
	    }
	    
	    function subdivide(x,y){//拡大後細分
		let m = expand(x);
		return[m[0]-x[0]+y[0],
		       m[1]-x[1]+y[1],
		       m[2]-x[2]+y[2],
		       m[3]-x[3]+y[3],
		       m[4]-x[4]+y[4]
		      ];
	    }
	    
	    function project(x){//五次元を二次元座標に表す
		let p=0;
		let q=0;
		for(let i=0; i<5; i++){
		    p += x[i]*Math.cos(i*Math.PI/5);
		    q += x[i]*Math.sin(i*Math.PI/5);
		}
		return {x:400+p*40,y:400-q*40};
	    }
	    
	    function AExpSub(T){//拡大細分後の４頂点を加えていく
		let V = [];
		V.push(expand(vertices[T[0]]));
		V.push(expand(vertices[T[1]]));
		V.push(expand(vertices[T[2]]));
		V.push(subdivide(vertices[T[0]],vertices[T[1]]));//細分
		return(V);   
	    }
	    function BExpSub(T){//拡大細分後の４頂点を加えていく
		let V = [];
		V.push(expand(vertices[T[0]]));
		V.push(expand(vertices[T[1]]));
		V.push(expand(vertices[T[2]]));
		V.push(subdivide(vertices[T[0]],vertices[T[1]]));//細分
		V.push(subdivide(vertices[T[0]],vertices[T[2]]));//細分
		return(V);   
	    }
	    
	    function pointEq(p,q){
		for(let i in p){//iにindexが入る
		    if(p[i] != q[i]) return false;
		} return true;
	    }
	    
	    function contained(p,V){
		for(let i in V){
		    if(pointEq(p,V[i])){
			return parseInt(i);
		    }
		    
		}
		return V.length;
	    }
	    
	    function allAExpSub(){//全てのA型三角を拡大細分してできる頂点集合を返す
		let V = [];
		let A = [];
		let B = [];
		for(let T of Atriangles){//一枚取り出す
		    let idx = [];
		    for(let p of AExpSub(T)){//拡大細分した4点の五次元座標を一つ取り出す
			idx.push(contained(p,V));//細分した4点のVにおけるインデックス
			if(contained(p,V)==V.length){//含まれていないときは
			    V.push(p);//Vに付け足す
			}
		    }
		    A.push([idx[2],idx[3],idx[1]]);//A型三角形のVのインデックス
		    B.push([idx[2],idx[3],idx[0]]);//B型三角形のVのインデックス
		}
		//この後にBを付け加える
		for(let T of Btriangles){//(一枚取り出す)
		    let idx = [];
		    for(let p of BExpSub(T)){//(拡大細分して)
			idx.push(contained(p,V));
			if(contained(p,V)==V.length){//含まれていないときは
			    V.push(p);
			}
		    }
		    A.push([idx[4],idx[3],idx[1]]);
		    B.push([idx[4],idx[3],idx[0]]);
		    B.push([idx[2],idx[4],idx[1]]);
		    
		}
		return({V:V,A:A,B:B});
		
	    }
	    //AtrianglesとBTrianglesに入れる
	    for(let i=0;i<N;i++){
		let tiling=allAExpSub();//allAExpSub() を実行し、V(頂点情報)、A(A型三角形のインデックス)、B(B型三角形のインデックス)が返る
		vertices=tiling.V;//verticesにVを入れ
		Atriangles = tiling.A;
		Btriangles = tiling.B;
	    }
	    
	    //ひし形作る
	    let Arhombi=[];
	    for(let i=0;i<Atriangles.length;i++){
		for(let j=i+1;j<Atriangles.length;j++){
		    if(Atriangles[i][1]==Atriangles[j][1]&&
		       Atriangles[i][2]==Atriangles[j][2]){
			Arhombi.push([Atriangles[i][0],Atriangles[i][1],Atriangles[j][0],Atriangles[j][2]]);
		    }
		}
	    }
	    
	    let Brhombi=[];
	    for(let i=0;i<Btriangles.length;i++){
		for(let j=i+1;j<Btriangles.length;j++){
	if(Btriangles[i][0]==Btriangles[j][0]&&
	   Btriangles[i][2]==Btriangles[j][2]){
	    Brhombi.push([Btriangles[i][0],Btriangles[i][1],Btriangles[j][2],Btriangles[j][1]]);
	}
		}
	    }
	    let rhombi= Arhombi.concat(Brhombi);
	    this.rhombi=rhombi;
	    let Astr = [];
	    for(let T of Arhombi){//Atriangles[0]から丸ごとTに入れていく
		let triangleStr = "";
		for(let v of T){
		    triangleStr += (" " + project(vertices[v]).x + " " +  project(vertices[v]).y)
		}
		Astr.push(triangleStr);
	    }
	    let Bstr = [];
	    for(let T of Brhombi){//Atriangles[0]から丸ごとTに入れていく
		let triangleStr = "";
		for(let v of T){
		    triangleStr += (" " + project(vertices[v]).x + " " +  project(vertices[v]).y)
		}
		Bstr.push(triangleStr);
	    }
	    
	    let Rstr = [];//A型もB型も入ってる
	    for(let T of rhombi){//Atriangles[0]から丸ごとTに入れていく
		let triangleStr = "";
		for(let v of T){
		    triangleStr += (" " + project(vertices[v]).x + " " +  project(vertices[v]).y)
		}
		Rstr.push(triangleStr);
	    }
	    console.log(Rstr);
	    return Rstr;
	}	
    }
}
function gauss(A) {
    let n = A.length;//ひし形が何枚あるか

    for (let i=0; i<n; i++) {
        // Search for maximum in this column 列の中で1を探す
        let  maxEl = Math.abs(A[i][i]);
        let maxRow = i;
        for(let k=i+1; k<n; k++) {
            if (Math.abs(A[k][i]) > maxEl) {
                maxEl = Math.abs(A[k][i]);
                maxRow = k;
            }
        }

        // Swap maximum row with current row (column by column) 
        for (let k=i; k<n+1; k++) {
            let tmp = A[maxRow][k];
            A[maxRow][k] = A[i][k];
            A[i][k] = tmp;
        }

        // Make all rows below this one 0 in current column
        for (let k=i+1; k<n; k++) {
            let c = A[k][i];
            for(let j=i; j<n+1; j++) {
                if (i==j) {
                    A[k][j] = 0;
                } else {
                    A[k][j] = (A[k][j]+ c * A[i][j])%2;
                }
            }
        }
    }
     // Solve equation Ax=b for an upper triangular matrix A
    let x= new Array(n);
    for (let i=n-1; i>-1; i--) {
        x[i] = A[i][n];
        for (let k=i-1; k>-1; k--) {
            A[k][n] = (A[k][n] + A[k][i] * x[i])%2;
        }
    }
    return x;
}

</script>

