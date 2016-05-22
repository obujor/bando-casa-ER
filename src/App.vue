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
    <div class="ui container houseList">
      <house-list :houses='houses'></house-list>
      <div class="ui active centered large inline loader"></div>
    </div>
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

$.fn.transition = require('semantic-ui-transition')
$.fn.dropdown = require('semantic-ui-dropdown')
$.fn.visibility = require('semantic-ui-visibility')
$.fn.dimmer = require('semantic-ui-dimmer')

const SLOT_SIZE = 50

export default {
  components: {
    HouseList
  },
  data () {
    return {
      allHouses: [],
      proviceFilter: [],
      cityFilter: [],
      slot: 1
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
    houses: function () {
      var provSelected = this.proviceFilter
      var citySelected = this.cityFilter
      var houses = this.allHouses
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
      var end = SLOT_SIZE * this.slot
      console.log(this.slot, houses.length)

      if (end < houses.length) {
        $('.houseList .loader').addClass('active')
      } else {
        $('.houseList .loader').removeClass('active')
      }
      return houses.slice(0, end)
    }
  },
  watch: {
    'proviceFilter': function (val, oldVal) {
      this.slot = 1
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
    var vue = this
    $('select.dropdown').dropdown({
      action: 'combo'
    })
    $('#app .houseList').visibility({
      once: false,
      // update size when new content loads
      observeChanges: true,
      // load content on bottom edge visible
      onBottomVisible: function () {
        if (vue.allHouses.length) {
          vue.slot++
        }
      }
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
    width: 300px;
    z-index: 1;
}

.logo {
  width: 100px;
  height: 100px
}

.menu .item.header {
  padding: 0 1.14286em;
}

body .ui.vertical.menu {
  width: 20rem;
}
</style>
