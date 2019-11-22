<template>
  <v-layout
    column
    justify-center
    align-center
     >
    <v-select :items="[1,2,3,4]" label="level" v-model="N"></v-select>
   <board :N="N"></board>
  </v-layout>
</template>

<script>
import board from '~/components/board.vue'

export default{
  components:{
      board
  },
    data(){
	return{
	    N:2
	}
    }
    
}
</script>
