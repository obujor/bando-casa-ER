<template>
  <div class="mapView">
    <map :map-type-id.sync="mapType" :center.sync="center" :zoom.sync="zoom" :bounds.sync="mapBounds" :options="{minZoom: 8, maxZoom: 20}" @g-click="mapClicked">
      <polygon :paths.sync="border" :editable="false" :options="{geodesic:false, strokeColor:'#000000', fillColor:'#000000', strokeWeight: 2}">
      </polygon>
      <polygon v-if="filterPathPolyVisible" :paths.sync="filterPath" :editable="true" :options="{geodesic:false, strokeColor:'#2185d0', fillColor:'#15FF00', strokeWeight: 5}">
      </polygon>
      <polygon v-if="choosenPathPolyVisible" :paths.sync="filterPath" :editable="false" :options="{geodesic:false, strokeColor:'#2185d0', fillColor:'#15FF00', fillOpacity: 0.15, strokeWeight: 2}">
      </polygon>
      <polyline v-if="filterPathVisible" :path.sync="filterPath" :editable="true" :options="{strokeColor:'#2185d0', strokeWeight: 5}" @g-click="pathClicked">
      </polyline>
      <info-window v-if="infoWindowShow" :position="infoWindowPos" :opened.sync="infoWindowShow">
        <div class="ui big relaxed divided selection list">
          <house-item-mini v-for="house in infoWindowHouses" :house='house'></house-item-mini>
        </div>
      </info-window>
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
import {load, Map, Polygon, Polyline, InfoWindow} from 'vue-google-maps'
import HouseItemMini from './HouseItemMini'
import $ from 'jquery'
import _ from 'underscore'
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
      mapBounds: {},
      border: [],
      filterPathVisible: false,
      filterPathPolyVisible: false,
      choosenPathPolyVisible: false,
      filterPath: [],
      markersShown: false,
      infoWindowPos: {lat: 0, lng: 0},
      infoWindowShow: false,
      infoWindowHouses: []
    }
  },
  computed: {
    markers: function () {
      return this.houses.map(function (house) {
        return {
          position: {lat: house.geo[0], lng: house.geo[1]},
          data: house,
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
    },
    showOnMap: function (house) {
      house.position = {lat: house.geo[0], lng: house.geo[1]}
      _.delay(() => {
        this.showInfoWindow([{data: house}], house.position)
        this.fitBoundsToMarkers([house])
      }, 100)
    }
  },
  watch: {
    markers: function () {
      if (this.$clusterObject) {
        this.showMarkers(true, true)
        this.fitBoundsToMarkers(this.markers)
      }
    }
  },
  methods: {
    createGmarkers: function () {
      return this.markers.map((data) => {
        const marker = new window.google.maps.Marker(data)
        marker.addListener('click', this.showInfoWindow.bind(this, [marker]))
        return marker
      })
    },
    showInfoWindow: function (markers, pos) {
      const targetMarker = markers[0]
      pos = targetMarker.getPosition ? targetMarker.getPosition().toJSON() : pos
      this.infoWindowPos = pos
      this.infoWindowHouses = _.pluck(markers, 'data')
      this.infoWindowShow = true
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
    },
    fitBoundsToMarkers: function (markers) {
      var bounds = new window.google.maps.LatLngBounds()
      markers.forEach((marker) => {
        bounds.extend(new window.google.maps.LatLng(marker.position.lat, marker.position.lng))
      })
      this.mapObject.fitBounds(bounds)
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
      window.google.maps.event.addListener(cmp.$clusterObject, 'clusterclick', (cluster) => {
        if (mapObject.getZoom() === mapObject.maxZoom) {
          this.showInfoWindow(cluster.getMarkers())
        }
      })
      cmp.mapObject = mapObject
    })

    $('.pathActions .erasePath').click(cmp.erasePath)
    $('.pathActions .confirmPath').click(cmp.confirmPath)
  },
  components: {
    Map,
    Polygon,
    Polyline,
    InfoWindow,
    HouseItemMini
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
