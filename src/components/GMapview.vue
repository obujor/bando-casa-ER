<template>
  <div class="mapView">
    <map :map-type-id.sync="mapType" :center.sync="center" :zoom.sync="zoom" :options="{minZoom: 8}"
          @g-dragend="mapDragged" @g-click="mapClicked">
      <polygon :paths.sync="border" :editable="false" :options="{geodesic:false, strokeColor:'#000000', fillColor:'#000000', strokeWeight: 2}">
      </polygon>
      <polygon v-if="filterPathPolyVisible" :paths.sync="filterPath" :editable="true" :options="{geodesic:false, strokeColor:'#2185d0', fillColor:'#15FF00', strokeWeight: 5}">
      </polygon>
      <polygon v-if="choosenPathPolyVisible" :paths.sync="filterPath" :editable="false" :options="{geodesic:false, strokeColor:'#2185d0', fillColor:'#15FF00', fillOpacity: 0.15, strokeWeight: 2}">
      </polygon>
      <polyline v-if="filterPathVisible" :path.sync="filterPath" :editable="true" :options="{strokeColor:'#2185d0', strokeWeight: 5}" @g-click="pathClicked">
      </polyline>
    </map>
    <div class="ui dimmer">
      <div class="content">
        <div class="center">
          <h2 class="ui inverted icon header">
            <i class="paint brush icon"></i>
            Disegna un'area sulla mappa
          </h2>
          <h3 class="ui inverted header">
            Clicca sulla mappa per creare un poligono relativo all'area di ricerca che ti interessa
          </h2>
        </div>
      </div>
    </div>
    <div class="pathActions transition hidden">
      <div class="ui buttons">
        <button class="ui button icon erasePath">
          <i class="erase icon"></i>Cancella
        </button>
        <div class="or" data-text="o"></div>
        <button class="ui button positive icon confirmPath">
          <i class="checkmark icon"></i>Conferma
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {load, Map, Polygon, Polyline} from 'vue-google-maps'
import $ from 'jquery'
// Using directly js-marker-clusterer instead of Marker and Cluser of vue-google-maps
// because of performace reasons, there're a lot of markers to show
require('js-marker-clusterer')

// Prevent to load multiple times
if (!window.google || !window.google.maps) {
  load('KEY', false, ['geometry'])
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
      limitBounds: [{lat: 43.23050, lng: 9.50790}, {lat: 45.82774, lng: 12.97657}],
      border: [],
      filterPathVisible: false,
      filterPathPolyVisible: false,
      choosenPathPolyVisible: false,
      filterPath: [],
      markersShown: false
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
      if (cmp === this) {
        if (!this.shown) {
          this.shown = true
          this.$broadcast('g-resize-map')
        }
        this.showMarkers(true)
      }
    },
    showMapFilter: function () {
      this.$broadcast('g-resize-map')
    },
    mapFilter: function () {
      if (!this.filterPath.length) {
        $('.mapView .dimmer').dimmer('show')
        this.setFilterPathVisibility(true, false, false)
      } else {
        this.setFilterPathVisibility(false, true, false)
      }
      this.showMarkers(false)
    },
    clearMapFilter: function () {
      this.filterPath = []
    }
  },
  watch: {
    markers: function () {
      if (this.$clusterObject) {
        this.showMarkers(true, true)
      }
    }
  },
  methods: {
    createGmarkers: function () {
      return this.markers.map(function (data) {
        return new window.google.maps.Marker(data)
      })
    },
    mapClicked: function (mouseArgs) {
      if (this.filterPathVisible) {
        this.filterPath.push(mouseArgs.latLng)
      }
    },
    pathClicked: function (args, b) {
      if (args.vertex === 0) {
        // Close the polygon
        this.filterPath.push(this.filterPath[0])
        this.setFilterPathVisibility(false, true)
      }
    },
    mapDragged: function () {
      // TODO: finish the limit
      // console.log(this.center)
      // if (this.strictBounds.contains(this.mapObject.getCenter())) return
      // // Set the center in order to limit the dragging
      // var lat = this.center.lat
      // var lng = this.center.lng
      // if (lat < this.limitBounds[0].lat) lat = this.limitBounds[0].lat
      // if (lat > this.limitBounds[1].lat) lat = this.limitBounds[1].lat
      // if (lng < this.limitBounds[0].lng) lng = this.limitBounds[0].lng
      // if (lng > this.limitBounds[1].lng) lng = this.limitBounds[1].lng

      // this.$set('center', {lat: lat, lng: lng})
      // console.log('dragged')
      // console.log(this)
    },
    showMarkers: function (show, forceUpdate) {
      if (show && this.markersShown && !forceUpdate) return
      this.$clusterObject.clearMarkers()
      if (show) {
        this.$clusterObject.addMarkers(this.createGmarkers())
      }
      this.markersShown = show
    },
    pathContainsLoc: function (polygon, loc) {
      const point = new window.google.maps.LatLng(loc[0], loc[1])
      return window.google.maps.geometry.poly.containsLocation(point, polygon)
    },
    erasePath: function () {
      this.filterPath = []
      this.setFilterPathVisibility(true, false)
    },
    confirmPath: function () {
      this.setFilterPathVisibility(false, false, true)
      const poly = new window.google.maps.Polygon({paths: this.filterPath})
      const area = window.google.maps.geometry.spherical.computeArea(poly.getPath(), 6378.137)
      this.$dispatch('mapFilterFn', this.pathContainsLoc.bind(this, poly), area)
    },
    setFilterPathVisibility: function (path, pathPoly, choosenPath) {
      this.$set('filterPathVisible', path)
      this.$set('filterPathPolyVisible', pathPoly)
      this.$set('choosenPathPolyVisible', choosenPath)
      if (pathPoly) {
        $('.pathActions').removeClass('hidden')
      } else {
        $('.pathActions').addClass('hidden')
      }
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
    mapCmp.mapCreated.then((mapObject) => {
      cmp.$clusterObject = new window.MarkerClusterer(mapObject, cmp.createGmarkers(), clusterOptions)
      var strictBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(cmp.limitBounds[0].lat, cmp.limitBounds[0].lng),
        new window.google.maps.LatLng(cmp.limitBounds[1].lat, cmp.limitBounds[1].lng)
      )
      cmp.strictBounds = strictBounds
      cmp.mapObject = mapObject
    })

    $('.pathActions .erasePath').click(cmp.erasePath)
    $('.pathActions .confirmPath').click(cmp.confirmPath)
  },
  components: {
    Map,
    Polygon,
    Polyline
  }
}

</script>

<style scoped lang="less">
.mapView, map {
  width: 100%;
  height: 600px;
  position: relative;
}
.pathActions {
  position: absolute;
  bottom: 20px;
  text-align: center;
  width: 100%;

  .buttons {
    width: 50%;
  }
}
</style>
