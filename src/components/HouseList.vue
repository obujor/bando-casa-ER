<template>
  <div class="ui container houseList">
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
      <div class="item" v-for="house in housesToShow">
        <div class="right floated content">
          <span class="mq"><i class="euro icon"></i>{{house.prezzoMq | euro}}</span>
          <span class="mq"><i class="square outline icon"></i>{{house.mq | float}}</span>
          <span><i class="euro icon"></i>{{house.prezzo | euro}}</span>
        </div>
        <div class="content">
          <div class="header">{{house.indirizzo[0] | capitalizeWords}} {{house.indirizzo[1]}},&nbsp;{{house.indirizzo[2]  | capitalizeWords}}</div>
          <div class="meta">
            <span class="locali">{{house.locali+(house.locali > 1 ? ' locali' : ' locale')}}</span>
            <span>Piano {{house.indirizzo[5]}}</span>
            <span>Id {{house.id}}</span>
          </div>
          <div class="description">
                <p></p>
          </div>
        </div>
      </div>
    </div>
    <div class="ui active centered large inline loader"></div>
  </div>
</template>

<script>
import $ from 'jquery'
import _ from 'underscore'

const SLOT_SIZE = 50

export default {
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
    $(window).resize(_.debounce(this.updateWidth, 100))
  },
  methods: {
    updateWidth: () => {
      console.log($('.houseList').width())
      $('.listStatus').width($('.houseList').width())
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

  .houseList .ui.list > .item {
    padding-left: 1em;
    padding-right: 1em;
  }

  .mq:after {
    content: ' m²';
  }
</style>
