<template>
  <div class="ui big relaxed divided selection list">
    <div class="item" v-for="house in houses">
      <div class="right floated content">
        <span class="mq"><i class="euro icon"></i>{{house.prezzoMq | euro}}</span>
        <span class="mq"><i class="square outline icon"></i>{{house.mq | float}}</span>
        <span><i class="euro icon"></i>{{house.prezzo | euro}}</span>
      </div>
      <div class="content">
        <div class="header">{{house.indirizzo[0] | capitalizeWords}} {{house.indirizzo[1]}},&nbsp;{{house.indirizzo[2]  | capitalizeWords}}</div>
        <div class="meta">
          <span class="locali">{{house.locali+(house.locali > 1 ? ' locali' : ' locale')}}</span>
        </div>
        <div class="description">
              <p></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['houses'],
  data () {
    return {}
  }
}
</script>

<style scoped>
  .mq:after {
    content: ' m²';
  }
</style>
