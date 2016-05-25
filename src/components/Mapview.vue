<template>
  <div class="mapView">
    <map :map-type-id.sync="mapType" :center.sync="center" :zoom.sync="zoom">
      <!-- <marker 
        v-for="m in markers"
        :position.sync="m.position"
        :clickable="true"
        :draggable="true"
        @g-click="center=m.position"
      ></marker> -->
    </map>
  </div>
</template>

<script>
import {load, Map, Marker} from 'vue-google-maps'

load('KEY')
console.log(Map, Marker)
export default {
  data () {
    return {
      center: {lat: 44.4355049, lng: 10.9767866},
      mapType: 'roadmap',
      zoom: 8,
      markers: [{
        position: {lat: 10.0, lng: 10.0}
      }, {
        position: {lat: 11.0, lng: 11.0}
      }]
    }
  },
  components: {
    Map,
    Marker
  }
}

</script>

<style scoped>
.mapView, map {
  width:100%;
  height: 600px;
  display: block;
}
</style>
