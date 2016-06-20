<template>
  <div class="item houseItem" data-id="{{house.id}}" v-on:click="itemToggleDetail">
    <div class="right floated content">
      <span class="mq"><i class="euro icon"></i>{{house.prezzoMq | euro}}</span>
      <span class="mq"><i class="square outline icon"></i>{{house.mq | float}}</span>
      <span><i class="euro icon"></i>{{house.prezzo | euro}}</span>
    </div>
    <div class="content">
      <div class="header">{{house.indirizzo[0] | capitalizeWords}} {{house.indirizzo[1]}},&nbsp;{{house.indirizzo[2]  | capitalizeWords}}</div>
      <div class="meta">
        <span class="locali">{{house.locali+(house.locali > 1 ? ' locali' : ' locale')}}</span>
        <span>- Piano {{house.indirizzo[5]}}</span>
        <span>- Data {{house.data}}</span>
        <span v-if="house.prezzoMensile">
        - Canone <i class="euro icon"></i>{{house.prezzoMensile | euro}}
        </span>
        <span>- ID {{house.id}}</span>
      </div>
      <div v-show="showDetails" class="description">
        <div class="ui segments">
          <div class="ui segment">
            <h3>Superficie utile <span class="mq">{{house.supUtile.totale | float}}</span></h3>
          </div>
          <div class="ui horizontal segments">
            <div v-if="house.supUtile.ingresso" class="ui segment">
              Ingresso <span class="mq">{{house.supUtile.ingresso | float}}</span>
            </div>
            <div v-if="house.supUtile.soggiorno" class="ui segment">
              Soggiorno <span class="mq">{{house.supUtile.soggiorno | float}}</span>
            </div>
            <div v-if="house.supUtile.cucina" class="ui segment">
              Cucina <span class="mq">{{house.supUtile.cucina | float}}</span>
            </div>
            <div v-if="house.supUtile.disimpegni" class="ui segment">
              Disimpegni <span class="mq">{{house.supUtile.disimpegni | float}}</span>
            </div>
            <div v-if="house.supUtile.ripostigli" class="ui segment">
              Ripostigli <span class="mq">{{house.supUtile.ripostigli | float}}</span>
            </div>
            <div v-if="house.supUtile.altro" class="ui segment">
              Altro <span class="mq">{{house.supUtile.altro | float}}</span>
            </div>
          </div>
          <div class="ui horizontal segments">
            <div v-for="mqr in house.supUtile.camere" track-by="$index" class="ui segment">
              Camera <span class="mq">{{mqr | float}}</span>
            </div>
            <div v-for="mqb in house.supUtile.bagni" track-by="$index" class="ui segment">
              Bagno <span class="mq">{{mqb | float}}</span>
            </div>
          </div>
          <div v-if="house.supAcc.totale" class="ui segment">
            <h3>Superficie accesoria <span class="mq">{{house.supAcc.totale | float}}</span> (calcolati nel totale <span class="mq">{{house.supAcc.mq | float}}</span>) </h3>
          </div>
          <div v-if="house.supAcc.totale" class="ui horizontal segments">
            <div v-if="house.supAcc.balconi" class="ui segment">
              Balconi <span class="mq">{{house.supAcc.balconi | float}}</span>
            </div>
            <div v-if="house.supAcc.garage" class="ui segment">
              Garage <span class="mq">{{house.supAcc.garage | float}}</span>
            </div>
            <div v-if="house.supAcc.cantine" class="ui segment">
              Cantine <span class="mq">{{house.supAcc.cantine | float}}</span>
            </div>
            <div v-if="house.supAcc.soffitte" class="ui segment">
              Soffitte <span class="mq">{{house.supAcc.soffitte | float}}</span>
            </div>
            <div v-if="house.supAcc.scala" class="ui segment">
              Scala <span class="mq">{{house.supAcc.scala | float}}</span>
            </div>
            <div v-if="house.supAcc.partiComuni" class="ui segment">
              Parti comuni <span class="mq">{{house.supAcc.partiComuni | float}}</span>
            </div>
          </div>
          <div class="ui horizontal segments">
            <div class="ui segment">
              <h3>Operatore </h3>
            </div>
            <div class="ui segment">
              {{house.operatore.nome}}
            </div>
            <div class="ui segment">
              <i class="phone icon"></i>{{house.operatore.tel}}
            </div>
            <div class="ui segment">
              <i class="mail icon"></i><a href="mailto:{{house.operatore.email}}?Subject=Informazioni alloggio ID {{house.id}} Bando casa Emilia Romagna" target="_top">{{house.operatore.email}}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  props: ['house'],
  data () {
    return {
      showDetails: false
    }
  },
  methods: {
    itemToggleDetail: function (evt) {
      if ($(evt.target).is('a')) return
      this.showDetails = !this.showDetails
    }
  }
}
</script>

<style lang="less">
  .ui.selection.list > .item.houseItem {
    padding-left: 1em;
    padding-right: 1.5em;
  }
</style>
