<template>
  <v-layout
    column
    justify-center
    align-center
  >
   <board></board>
  </v-layout>
</template>

<script>
import board from '~/components/board.vue'
import tile from '~/components/tile.vue'

export default {
  components: {
      board,
      tile
  },
}
</script>
