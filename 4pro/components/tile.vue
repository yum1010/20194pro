<template>
<polygon
   :points="points"
   :fill="onoff==1? 'pink' : 'cyan'"
   stroke="black"
   :opacity="guided? 0.2 : 1"
   @click="toggle(id)"
   ></polygon>
</template>

<script>
export default{
     props:['points','onoff','id','guided'],//頂点の座標、タイルの状態、押されたタイルのid
     methods:{
         toggle(id){
             this.$emit('toggle',id);//toggleされたことを教える
         }
     }
}
</script>
