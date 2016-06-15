<template>
  <div id="app">
    <div class="toc">
      <div class="ui left fixed vertical menu">
        <div class="item header">
          <a class="ui image" href="/"><img class="logo" src="./assets/logo.png"></a>
        </div>
        <div  class="ui horizontal divider">
          Bando <div v-if="pubYear" class="ui blue tag label">{{pubYear}}</div>
        </div>
        <div class="item filters">
          <h3>Filtri <button class="ui compact right floated icon circular button clearFilters" data-content="Azzera i filtri">
            <i class="refresh icon"></i>
          </button></h3>

          <div class="ui styled fluid accordion">
            <div class="title">
              <i class="dropdown icon"></i>
              Ubicazione
            </div>
            <div class="content">
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
              <div class="ui center aligned basic segment">
                <div class="ui horizontal divider">
                  Oppure
                </div>
                <div class="ui blue labeled icon button drawOnMap">
                  Disegna sulla mappa
                  <i class="map icon"></i>
                </div>
                <div v-show="selectedMapArea" class="selectedArea">
                  <div class="ui large label">
                    Area scelta
                    <div class="detail supArea">{{Math.round(selectedMapArea * 100) / 100 | float}}</div>
                    <i class="delete icon"></i>
                  </div>
                  <div class="ui fluid popup">
                    <h4 class="ui header">Sei sicuro di voler eliminare l'area selezionata?</h4>
                    <div class="ui buttons">
                      <div class="ui positive button">No</div>
                      <div class="ui negative button">Sì</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="title">
              <i class="dropdown icon"></i>
              Prezzo
            </div>
            <div class="content">
              <form class="ui form">
                <div class="field">
                  <label>Complessivo</label>
                  <input type="text" id="priceSlider" value="" />
                </div>
                <div class="field">
                  <label>Metro quadrato</label>
                  <input type="text" id="pricemqSlider" value="" />
                </div>
              </form>
            </div>
            <div class="title">
              <i class="dropdown icon"></i>
              Dimensione
            </div>
            <div class="content">
              <form class="ui form">
                <div class="field">
                  <label>Locali</label>
                  <input type="text" id="locSlider" value="" />
                </div>
                <div class="field">
                  <label>Superficie</label>
                  <input type="text" id="mqSlider" value="" />
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="item">
          <h3>Alloggi trovati {{housesFiltered.length}}</h3>
          <div class="ui center aligned basic segment">
            <div class="ui buttons toggleView">
              <button class="ui button icon active houseListToggle" data-show="houselist">
                <i class="list layout icon"></i>Elenco
              </button>
              <div class="or" data-text="o"></div>
              <button class="ui button icon houseMapToggle" data-show="housemap">
                <i class="map icon"></i>
                Mappa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="houseViews">
      <house-list v-show="showhouselist" v-ref:houselist :houses='housesFiltered'></house-list>
      <g-mapview v-show="showhousemap" v-ref:housemap :houses='housesFiltered'></g-mapview>
    </div>
  </div>
</template>

<script>
import HouseList from './components/HouseList'
import GMapview from './components/GMapview'
import LZString from 'lz-string'
import $ from 'jquery'
import _ from 'underscore'
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
import 'semantic-ui-button/button.css'
import 'semantic-ui-accordion/accordion.css'
import 'semantic-ui-divider/divider.css'
import 'semantic-ui-popup/popup.css'
import 'ion-rangeslider/css/ion.rangeSlider.css'
import 'ion-rangeslider/css/ion.rangeSlider.skinFlat.css'
require('ion-rangeslider')

window.$ = $

$.fn.transition = require('semantic-ui-transition')
$.fn.dropdown = require('semantic-ui-dropdown')
$.fn.visibility = require('semantic-ui-visibility')
$.fn.dimmer = require('semantic-ui-dimmer')
$.fn.progress = require('semantic-ui-progress')
$.fn.accordion = require('semantic-ui-accordion')
$.fn.popup = require('semantic-ui-popup')

export default {
  components: {
    HouseList,
    GMapview
  },
  data () {
    return {
      allHouses: [],
      proviceFilter: [],
      cityFilter: [],
      priceRange: [],
      priceMqRange: [],
      locRange: [],
      mqRange: [],
      mapFilterFn: false,
      selectedMapArea: 0,
      showhouselist: false,
      showhousemap: false,
      pubYear: 0
    }
  },
  computed: {
    provinces: function () {
      return _.uniq(this.allHouses.map(function (h) {
        return h.indirizzo[3]
      })).sort()
    },
    maxValues: function () {
      return {
        pr: _.max(_.pluck(this.allHouses, 'prezzo')),
        prMq: _.max(_.pluck(this.allHouses, 'prezzoMq')),
        loc: _.max(_.pluck(this.allHouses, 'locali')),
        mq: _.max(_.pluck(this.allHouses, 'mq'))
      }
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
      const provSelected = this.proviceFilter
      const citySelected = this.cityFilter
      const priceRange = this.priceRange
      const priceMqRange = this.priceMqRange
      const locRange = this.locRange
      const mqRange = this.mqRange
      const mapFilterFn = this.mapFilterFn

      const rangeFilter = (attr, range, item) => {
        return item[attr] >= range[0] && item[attr] <= range[1]
      }

      var houses = this.allHouses
      console.time('filter')
      if (mapFilterFn) {
        houses = houses.filter((h) => {
          return mapFilterFn(h.geo)
        })
      } else {
        if (provSelected.length && provSelected.join().length) {
          houses = houses.filter((h) => {
            return provSelected.indexOf(h.indirizzo[3]) !== -1
          })
        }
        if (citySelected.length && citySelected.join().length) {
          houses = houses.filter((h) => {
            return citySelected.indexOf(h.indirizzo[2]) !== -1
          })
        }
      }
      if (priceRange.length) {
        houses = houses.filter(rangeFilter.bind(this, 'prezzo', priceRange))
      }
      if (priceMqRange.length) {
        houses = houses.filter(rangeFilter.bind(this, 'prezzoMq', priceMqRange))
      }
      if (locRange.length) {
        houses = houses.filter(rangeFilter.bind(this, 'locali', locRange))
      }
      if (mqRange.length) {
        houses = houses.filter(rangeFilter.bind(this, 'mq', mqRange))
      }
      console.timeEnd('filter')
      this.$broadcast('filtersChanged')
      return houses
    }
  },
  watch: {
    maxValues: function () {
      this.setupSliders()
    },
    selectedMapArea: function (val) {
      if (!val) {
        this.$set('mapFilterFn', false)
        this.$broadcast('clearMapFilter')
        $('.toc .form .ui.dropdown').removeClass('disabled')
      } else {
        $('.toc .form .ui.dropdown').addClass('disabled')
        if (this.proviceFilter.length || this.cityFilter.length) {
          $('.toc .form .ui.dropdown').dropdown('clear')
        }
      }
    }
  },
  events: {
    mapFilterFn: function (constainsLocFn, area) {
      this.$set('selectedMapArea', area)
      this.$set('mapFilterFn', constainsLocFn)
    }
  },
  ready: function () {
    this.$http({url: '/static/data_2015_lz.json', method: 'GET'}).then(function (response) {
      var data = JSON.parse(LZString.decompressFromUTF16(response.data))
      data = data.map(function (item) {
        item.locali = item.supUtile.soggiorno !== undefined ? 1 : 0
        item.locali += (item.supUtile.camere && item.supUtile.camere.length)
                        ? item.supUtile.camere.length : 0
        return item
      })
      this.$set('pubYear', 2015)
      this.$set('allHouses', data)
    })
    $('.toc select.dropdown').dropdown({
      action: 'combo'
    })
    $('.ui.accordion').accordion()
    $('.drawOnMap').click(() => {
      this.toggleView($('.toggleView .houseMapToggle'), 'showMapFilter')
      this.$broadcast('mapFilter')
    })
    this.setupToggleView()
    this.setupDeleteSelectedArea()
    this.setupFilterClear()
  },
  methods: {
    setupSliders: function () {
      const ceilTo = (nr, to) => {
        return Math.ceil(nr / to) * to
      }
      const update = (attr, data) => {
        this.$set(attr, [data.from, data.to])
      }
      const cfg = {
        min: 0,
        from: 0,
        type: 'double',
        grid: true
      }
      const createSlider = (sel, max, step, attr, prefix, postfix) => {
        $(sel).ionRangeSlider(_.extend({
          max: max,
          to: max,
          step: step,
          prefix: prefix || '',
          postfix: postfix || '',
          onFinish: update.bind(this, attr)
        }, cfg))
      }
      const maxPr = ceilTo(this.maxValues.pr, 10000)
      const maxPrMq = ceilTo(this.maxValues.prMq, 500)
      const maxMq = ceilTo(this.maxValues.mq, 5)
      createSlider('#priceSlider', maxPr, 20000, 'priceRange', '€')
      createSlider('#pricemqSlider', maxPrMq, 500, 'priceMqRange', '€')
      createSlider('#locSlider', this.maxValues.loc, 1, 'locRange')
      createSlider('#mqSlider', maxMq, 10, 'mqRange', '', ' m²')
    },
    setupToggleView: function () {
      const vue = this
      vue.toggleView($('.toggleView .ui.button.active'))
      $('.toggleView .ui.button').click(function () {
        if ($(this).hasClass('active')) return
        vue.toggleView($(this))
      })
    },
    toggleView: function ($btn, evtName) {
      evtName = evtName || 'showCmp'
      $btn.addClass('active')
      const sib = $btn.siblings('.button')
      const showCmp = $btn.data('show')
      const hideCmp = sib.data('show')
      const vue = this
      sib.removeClass('active')
      const cmp = vue.$refs[showCmp]
      this.$set('show' + hideCmp, false)
      if (!this['show' + showCmp]) {
        this.$set('show' + showCmp, true)
        setTimeout(function () {
          vue.$broadcast(evtName, cmp)
        }, 50)
      }
    },
    setupDeleteSelectedArea: function () {
      const $popup = $('.selectedArea .delete')
      $popup.popup({
        popup: $('.selectedArea .popup'),
        on: 'click'
      })

      $('.selectedArea .popup .positive').click(() => {
        $popup.popup('hide')
      })
      $('.selectedArea .popup .negative').click(() => {
        $popup.popup('hide')
        this.$set('selectedMapArea', 0)
      })
    },
    setupFilterClear: function () {
      const $btn = $('.clearFilters')
      $btn.popup()
      $btn.click(() => {
        $('.toc .form .ui.dropdown').dropdown('clear')
        this.$set('selectedMapArea', 0)
        $('#priceSlider').data('ionRangeSlider').reset()
        $('#pricemqSlider').data('ionRangeSlider').reset()
        $('#locSlider').data('ionRangeSlider').reset()
        $('#mqSlider').data('ionRangeSlider').reset()
        this.priceRange = []
        this.priceMqRange = []
        this.locRange = []
        this.mqRange = []
      })
    }
  }
}

</script>

<style lang="less">
#app {
  color: #2c3e50;
  font-family: Source Sans Pro, Helvetica, sans-serif;
  width: 100%;
  display: flex;
  flex-direction: row;

  > .toc {
    flex: 0 0 280px;
    position: relative;
    z-index: 1;
    
    .menu .item.header {
      padding: 0 0.2em;
      text-align: center;
    }

    .ui.menu .item.filters {
      padding-top: 0;
      &::before {
        background: transparent none repeat scroll 0 0;
      }
    }

    .ui.segment {
      margin: 0;
      padding: 0;
    }
    
  }

  > .houseViews {
    flex: 1 1;
  }
}

.toc {
  .item h3 {
    margin-bottom: 5px;
  }
  .ui.styled.accordion {
    border-radius: 0;
    box-shadow: initial;
  }

  .ui.styled.accordion .content, .ui.styled.accordion .accordion .content {
    padding: 0.5em 0em 1.5em;
  }

  .irs-from, .irs-to, .irs-single {
    background: #3B97D3;
    &:after {
      border-top-color: #3B97D3;
    }
  }
}

body .ui.vertical.menu {
  width: 20rem;
}

.selectedArea {
  padding: 1em;

  .supArea:after {
    content: ' km²';
  }
}

</style>
