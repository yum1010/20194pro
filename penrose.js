let N=2;

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
let rhombi=Arhombi.concat(Brhombi);


//描画のため
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

let onoff=[];
let guided=[];
for(let r of rhombi){
    onoff.push(0);//初期値0
    guided.push(0);
}


function isAdjacent(r,s){//二つのひし形r,sが隣接しているか
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
}

let A= [];//スイッチ行列(押すことで反転する場所)
for(let i in rhombi){
    A.push([]);
    for(let j in rhombi){
	A[i].push(0);
    }
}


let adjacentList = [];//それに隣接するひし形の添え字
for(let i in rhombi){
    let alist=[];//一つのrhonbi
    A[i][i]=1;//自分自身も反転
    for(let j in rhombi){
	if(isAdjacent(rhombi[i],rhombi[j])){//ひし形iとjが隣接してるなら
	    alist.push(j);
	    A[j][i]=1;//スイッチ行列に1を
	}
    }
    adjacentList.push(alist);
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
        for (k=i+1; k<n; k++) {
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
let M=[[1,1,1],[0,1,1]];
console.log(gauss(M));

Vue.component('ansbutton',{
    template: '<g @click="answer" transform="translate(50,750)">'+
	'<rect  width=100 height=50 stroke="cyan" fill="white"></rect>'+
	'<text x=20 y=30> answer </text>'+
	'</g>',
    methods:{
	answer:function(){
	    for(let i in onoff){
		A[i].push(onoff[i]);
	    }
	    console.log(gauss(A));
	}
    }
})

Vue.component('tile',{
    template:'<polygon :points="points" :fill="onoff==1? \'pink\' : \'cyan\'" stroke="black" @click="toggle"></polygon>',
    props:['points','onoff'],
    methods:{
	toggle(){
	    this.$emit('toggle');
	}
    }
    /*
     <polygon v-for="(t,i) in rhombi"
	       @click="toggle(i)"
	       @mouseover="guide(i)"
	       @mouseleave="unguide(i)"
	       :points="t"
	       :stroke="guided[i]==1? 'red' : 'black'"
	       :fill="onoff[i]==1? 'pink' : 'cyan'"
	       :fill-opacity="guided[i]==1? 0:1">
      </polygon>
*/
})


let app = new Vue({
    el: '#penrose', //penroseというidをもつエレメントに書き込み
    data: {
	Arhombi : Astr,
	Brhombi : Bstr,
	rhombi : Rstr,
	onoff : onoff,
	adjacentList : adjacentList,
	guided : guided,
    },
    methods: {//action
	toggle: function(i){
	   // console.log(i);
	    this.onoff.splice(i,1,1-this.onoff[i]);//i番目を1つだけ1なら0に0なら1に	    
	    for(let j of this.adjacentList[i]){//隣接するひし形を一つ取り出して
		this.onoff.splice(j,1,1-this.onoff[j]);//隣接するひし形反転
	    }
	},
	guide: function(i){
	    console.log(i);
	    this.guided.splice(i,1,1);//i番目を1つだけ1なら0に0なら1に	    
	    for(let j of this.adjacentList[i]){//隣接するひし形を一つ取り出して
		this.guided.splice(j,1,1);//隣接するひし形反転
	    }
	},
	unguide: function(i){
	    this.guided.splice(i,1,0);//i番目を1つだけ1なら0に0なら1に	    
	    for(let j of this.adjacentList[i]){//隣接するひし形を一つ取り出して
		this.guided.splice(j,1,0);//隣接するひし形反転
	    }
	}

    }
});
