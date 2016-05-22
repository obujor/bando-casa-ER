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
      <div class="item listStatus">
        <div class="ui blue attached top progress">
          <div class="bar"></div>
        </div>
        <div class="ui borderless menu">
          <div class="ui text container">
            <div href="#" class="header item">
              Alloggi visualizzati {{houses.length}}/{{housesFiltered.length}}
            </div>
            <select class="ui right floated dropdown item listOrdering" v-model="listOrder">
              <option value="">Ordinamento</option>
              <option value="mc">Meno costosi</option>
              <option value="mcmq">Meno costosi al m²</option>
              <option value="ms">Meno spaziosi</option>
              <option value="pc">Più costosi</option>
              <option value="pcmq">Più costosi al m²</option>
              <option value="ps">Più spaziosi</option>
            </select>
          </div>
        </div>
      </div>
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
import 'semantic-ui-progress/progress.css'

$.fn.transition = require('semantic-ui-transition')
$.fn.dropdown = require('semantic-ui-dropdown')
$.fn.visibility = require('semantic-ui-visibility')
$.fn.dimmer = require('semantic-ui-dimmer')
$.fn.progress = require('semantic-ui-progress')

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
      listOrder: '',
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
    housesFiltered: function () {
      var provSelected = this.proviceFilter
      var citySelected = this.cityFilter
      var houses = this.allHouses
      this.slot = 1
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
    },
    housesOrdered: function () {
      var houses = this.housesFiltered
      var order = this.listOrder
      var sortAsc = function (prop) {
        return houses.sort(function (a, b) {
          return a[prop] - b[prop]
        })
      }

      var sortDesc = function (prop) {
        return houses.sort(function (a, b) {
          return b[prop] - a[prop]
        })
      }

      switch (order) {
        case 'mc':
          return sortAsc('prezzo')
        case 'pc':
          return sortDesc('prezzo')
        case 'mcmq':
          return sortAsc('prezzoMq')
        case 'pcmq':
          return sortDesc('prezzoMq')
        case 'ms':
          return sortAsc('mq')
        case 'ps':
          return sortDesc('mq')
        default:
          return houses
      }
    },
    houses: function () {
      var end = SLOT_SIZE * this.slot
      if (end < this.housesOrdered.length) {
        $('.houseList .loader').addClass('active')
      } else {
        $('.houseList .loader').removeClass('active')
      }
      var houses = this.housesOrdered.slice(0, end)
      $('.listStatus .progress').progress({percent: houses.length / this.housesOrdered.length * 100})
      return houses
    }
  },
  watch: {
    'proviceFilter': function (val, oldVal) {
      this.slot = 1
    }
  },
  ready: function () {
    var vue = this
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
    $('.houseList .dropdown.listOrdering').dropdown()

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
    $('.listStatus').visibility({
      type: 'fixed'
    })
    $('.houseList .progress').progress({
      percent: 0
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

.logo {
  width: 100px;
  height: 100px
}
.listStatus {
  width: 100%;
  background-color: #FFFFFF;
}
.listStatus .ui.menu {
  background-color: #FFFFFF;
  border: 1px solid #DDD;
  border-left: 0px;
  border-top: 0px;
  border-right: 0px;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
  margin: 0;
  border-radius: 0;
}

.listStatus .ui.progress.top.attached, .listStatus .ui.progress.top.attached .bar {
  border-radius: 0;
}

.menu .item.header {
  padding: 0 1.14286em;
}

body .ui.vertical.menu {
  width: 20rem;
}

</style>
