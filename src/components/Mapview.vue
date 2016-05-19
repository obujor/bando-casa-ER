<template>
  <div id="map" class="map"></div>
</template>

<script>
import L from 'leaflet'
console.log(L)

export default {
  data () {
    return {
      msg: 'Hello World!'
    }
  },
  ready: function () {
    this.map = L.map('map').setView([44.4355049, 10.9767866], 10)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
  height: 300px; 
}
</style>
