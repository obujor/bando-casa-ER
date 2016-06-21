<template>
  <div class="item houseItem" data-id="{{house.id}}" v-on:click="itemToggleDetail">
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
      <div class="meta">
        <span class="mq"><i class="euro icon"></i>{{house.prezzoMq | euro}}</span>
        <span class="mq"><i class="square outline icon"></i>{{house.mq | float}}</span>
        <span><i class="euro icon"></i>{{house.prezzo | euro}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['house'],
  data () {
    return {}
  },
  methods: {
    itemToggleDetail: function (evt) {
      console.log(evt)
    }
  }
}
</script>

<style lang="less">
</style>
