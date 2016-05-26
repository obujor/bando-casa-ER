<template>
  <div class="mapView">
    <map :map-type-id.sync="mapType" :center.sync="center" :zoom.sync="zoom">
      <cluster :grid-size="50"
                :styles="cluster_styles">
        <marker
          v-for="m in markers"
          :position.sync="m.position"
          :clickable.sync="m.clickable"
          :draggable.sync="m.draggable"
          @g-click="center=m.position"
        ></marker>
      </cluster>
    </map>
  </div>
</template>

<script>
import {load, Map, Marker, Cluster} from 'vue-google-maps'

// Prevent to load multiple times
if (!window.google || !window.google.maps) {
  load('KEY')
}

export default {
  props: ['houses'],
  data () {
    return {
      center: {lat: 44.4355049, lng: 10.9767866},
      mapType: 'roadmap',
      zoom: 8,
      shown: false,
      cluster_styles: [{
        url: '/static/cluster/m1.png',
        height: 53,
        width: 53,
        textColor: '#FFFFFF',
        textSize: 14
      }, {
        url: '/static/cluster/m2.png',
        height: 56,
        width: 56,
        textColor: '#FFFFFF',
        textSize: 14
      }, {
        url: '/static/cluster/m3.png',
        height: 65,
        width: 65,
        textColor: '#FFFFFF',
        textSize: 14
      }]
    }
  },
  computed: {
    markers: function () {
      return this.houses.map(function (house) {
        return {
          position: {lat: house.geo[0], lng: house.geo[1]},
          draggable: false,
          clickable: true
        }
      })
    }
  },
  events: {
    showCmp: function (cmp) {
      if (cmp === this && !this.shown) {
        this.shown = true
        this.$broadcast('g-resize-map')
      }
    }
  },
  components: {
    Map,
    Marker,
    Cluster
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
