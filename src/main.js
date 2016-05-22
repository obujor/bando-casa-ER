import Vue from 'vue'
import App from './App'

Vue.use(require('vue-resource'))
Vue.config.debug = true

Vue.filter('euro', function (value) {
  value = value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1.')
  return value.substring(0, value.length - 3)
})

Vue.filter('float', function (value) {
  return ('' + value).replace(/\./g, ',')
})

Vue.filter('capitalizeWords', function (value) {
  return value.replace(/'/g, '\' ').split(' ').map(function (word) {
    return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
  }).join(' ').replace(/' /g, '\'')
})

/* eslint-disable no-new */
new Vue({
  el: 'body',
  components: { App }
})
