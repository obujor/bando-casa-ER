<template>
  <div class="mapView">
    <map :map-type-id.sync="mapType" :center.sync="center" :zoom.sync="zoom">
      <polygon :paths.sync="border" :editable="false" :options="{geodesic:false, strokeColor:'#000000', fillColor:'#000000', strokeWeight: 2}">
      </polygon>
    </map>
  </div>
</template>

<script>
import {load, Map, Polygon} from 'vue-google-maps'
import $ from 'jquery'
// Using directly js-marker-clusterer instead of Marker and Cluser of vue-google-maps
// because of performace reasons, there're a lot of markers to show
require('js-marker-clusterer')

// Prevent to load multiple times
if (!window.google || !window.google.maps) {
  load('KEY')
}

const clusterOptions = {
  gridSize: 50,
  styles: [{
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

export default {
  props: ['houses'],
  data () {
    return {
      center: {lat: 44.4355049, lng: 10.9767866},
      mapType: 'roadmap',
      zoom: 8,
      shown: false,
      border: []
    }
  },
  computed: {
    markers: function () {
      return this.houses.map(function (house) {
        return {
          position: {lat: house.geo[0], lng: house.geo[1]},
          draggable: false,
          clickable: true,
          icon: '/static/apartment-marker.png'
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
  watch: {
    markers: function () {
      if (this.$clusterObject) {
        this.$clusterObject.clearMarkers()
        this.$clusterObject.addMarkers(this.createGmarkers())
      }
    }
  },
  methods: {
    createGmarkers: function () {
      return this.markers.map(function (data) {
        return new window.google.maps.Marker(data)
      })
    }
  },
  ready: function () {
    var cmp = this
    this.$http({url: '/static/ER-border.json', method: 'GET'}).then(function (response) {
      var data = response.data
      var toGeo = function (item) {
        return {lat: item[0], lng: item[1]}
      }
      this.$set('border', [data.bbox.map(toGeo), data.border.map(toGeo)])
    })
    $('.mapView, map').height($(window).height())
    var mapCmp = cmp.$children[0]
    mapCmp.mapCreated.then(function (mapObject) {
      cmp.$clusterObject = new window.MarkerClusterer(mapObject, cmp.createGmarkers(), clusterOptions)
    })
  },
  components: {
    Map,
    Polygon
  }
}

</script>

<style scoped>
.mapView, map {
  width: 100%;
  height: 600px;
}
</style>
