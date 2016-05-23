<template>

  <div id="app">
    <div class="toc">
      <div class="ui left fixed vertical menu">
        <div class="item header">
          <a class="ui image" href="/"><img class="logo" src="./assets/logo.png"></a>
        </div>
        <div class="item">
          <h3>Filtra</h3>
          <form class="ui form">
            <div class="field">
              <label>Provincia</label>
              <select multiple="multiple" class="ui dropdown" v-model="proviceFilter">
                <option value="">Tutte</option>
                <option v-for="province in provinces" value="{{ province }}">{{ province }}</option>
              </select>
            </div>
            <div class="field">
              <label>Città</label>
              <select multiple="multiple" class="ui dropdown" v-model="cityFilter">
                <option value="">Tutte</option>
                <option v-for="city in cities" value="{{ city }}">{{ city | capitalizeWords }}</option>
              </select>
            </div>
          </form>
        </div>
      </div>
    </div>
    <house-list :houses='housesFiltered'></house-list>
  </div>
</template>

<script>
import HouseList from './components/HouseList'
import LZString from 'lz-string'
import $ from 'jquery'
import _ from 'underscore'
window.$ = $
import 'semantic-ui-reset/reset.css'
import 'semantic-ui-site/site.css'
import 'semantic-ui-container/container.css'
import 'semantic-ui-grid/grid.css'
import 'semantic-ui-image/image.css'
import 'semantic-ui-menu/menu.css'
import 'semantic-ui-form/form.css'
import 'semantic-ui-dropdown/dropdown.css'
import 'semantic-ui-transition/transition.css'
import 'semantic-ui-icon/icon.css'
import 'semantic-ui-input/input.css'
import 'semantic-ui-label/label.css'
import 'semantic-ui-loader/loader.css'
import 'semantic-ui-segment/segment.css'
import 'semantic-ui-dimmer/dimmer.css'
import 'semantic-ui-list/list.css'
import 'semantic-ui-progress/progress.css'

$.fn.transition = require('semantic-ui-transition')
$.fn.dropdown = require('semantic-ui-dropdown')
$.fn.visibility = require('semantic-ui-visibility')
$.fn.dimmer = require('semantic-ui-dimmer')
$.fn.progress = require('semantic-ui-progress')

export default {
  components: {
    HouseList
  },
  data () {
    return {
      allHouses: [],
      proviceFilter: [],
      cityFilter: []
    }
  },
  computed: {
    provinces: function () {
      return _.uniq(this.allHouses.map(function (h) {
        return h.indirizzo[3]
      })).sort()
    },
    cities: function () {
      var provSelected = this.proviceFilter
      var houses = this.allHouses
      if (provSelected.length) {
        houses = houses.filter(function (h) {
          return provSelected.indexOf(h.indirizzo[3]) !== -1
        })
      }
      return _.uniq(houses.map(function (h) {
        return h.indirizzo[2]
      })).sort()
    },
    housesFiltered: function () {
      var provSelected = this.proviceFilter
      var citySelected = this.cityFilter
      var houses = this.allHouses

      this.$broadcast('filtersChanged')

      console.time('filter')
      if (provSelected.length) {
        houses = houses.filter(function (h) {
          return provSelected.indexOf(h.indirizzo[3]) !== -1
        })
      }
      if (citySelected.length) {
        houses = houses.filter(function (h) {
          return citySelected.indexOf(h.indirizzo[2]) !== -1
        })
      }
      console.timeEnd('filter')
      return houses
    }
  },
  ready: function () {
    // GET request
    this.$http({url: '/static/data_2015_lz.json', method: 'GET'}).then(function (response) {
      var data = JSON.parse(LZString.decompressFromUTF16(response.data))
      data = data.map(function (item) {
        item.locali = item.supUtile.soggiorno !== undefined ? 1 : 0
        item.locali += (item.supUtile.camere && item.supUtile.camere.length)
                        ? item.supUtile.camere.length : 0
        return item
      })
      this.$set('allHouses', data)
    })
    $('.toc select.dropdown').dropdown({
      action: 'combo'
    })
  }
}

</script>

<style>
#app {
  color: #2c3e50;
  font-family: Source Sans Pro, Helvetica, sans-serif;
  display: flex;
  flex-direction: row;
}

#app > .toc {
    flex: 0 0 auto;
    position: relative;
    width: 280px;
    z-index: 1;
}

#app .menu .item.header {
  padding: 0 0.2em;
}

body .ui.vertical.menu {
  width: 20rem;
}

</style>
