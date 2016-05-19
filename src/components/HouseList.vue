<template>
  <ul>
    <li v-for="house in houses">
      <p>{{ house.id+' - '+house.indirizzo.join(',') }}</p>
    </li>
  </ul>
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
</style>
