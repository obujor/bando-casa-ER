<template>
  <div class="houseList">
    <div class="item listStatus">
      <div class="ui blue attached top progress">
        <div class="bar"></div>
      </div>
      <div class="ui borderless menu">
        <div href="#" class="header item">
          Alloggi visualizzati {{housesToShow.length}}/{{housesOrdered.length}}
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
    <div class="ui big relaxed divided selection list">
      <house-item v-for="house in housesToShow" :house='house'></house-item>
      <div class="ui active centered large inline loader"></div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import _ from 'underscore'
import HouseItem from './HouseItem'

const SLOT_SIZE = 50

export default {
  components: {
    HouseItem
  },
  props: ['houses'],
  data () {
    return {
      slot: 1,
      listOrder: ''
    }
  },
  computed: {
    housesOrdered: function () {
      var houses = this.houses
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
    housesToShow: function () {
      var end = SLOT_SIZE * this.slot
      if (end < this.housesOrdered.length) {
        $('.houseList .loader').addClass('active')
      } else {
        $('.houseList .loader').removeClass('active')
      }
      var houses = this.housesOrdered.slice(0, end)
      updateProgress(houses.length / this.housesOrdered.length * 100)

      return houses
    }
  },
  events: {
    'filtersChanged': function () {
      this.slot = 1
    }
  },
  watch: {
    houses: function () {
      this.updateWidth()
    }
  },
  ready: function () {
    var vue = this
    $('.houseList .dropdown.listOrdering').dropdown()

    $('#app .houseList').visibility({
      once: false,
      // update size when new content loads
      observeChanges: true,
      // load content on bottom edge visible
      onBottomVisible: function () {
        if (vue.houses.length) {
          vue.slot++
        }
      }
    })
    $('.listStatus').visibility({
      type: 'fixed'
    })
    updateProgress()
    $(window).resize(_.debounce(this.updateWidth, 50))
  },
  methods: {
    updateWidth: () => {
      $('.listStatus').width($('.houseViews').width())
      $('.houseList').width($('.houseViews').width())
    }
  }
}

var updateProgress = function (percent) {
  percent = percent || 0
  $('.houseList .progress').progress({
    percent: percent,
    showActivity: false,
    autoSuccess: false
  })
}

</script>

<style lang="less">
  .listStatus {
    width: 100%; 
    background-color: #FFFFFF;
    .ui.menu {
      background-color: #FFFFFF;
      border: 1px solid #DDD;
      border-left: 0px;
      border-top: 0px;
      border-right: 0px;
      box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
      margin: 0;
      border-radius: 0;
    }

    .ui.right.listOrdering {
      margin-right: 2em;
    }

    .ui.progress.top.attached,.ui.progress.top.attached .bar {
      border-radius: 0;
    }
  }

  .houseList {
    width: 100%;
    position: relative;
  }

  .mq:after {
    content: ' m²';
  }
</style>
