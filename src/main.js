import Vue from 'vue'
import App from './App'
import Home from './Home'
import Browser from './Browser'
import VueRouter from 'vue-router'

Vue.use(require('vue-resource'))
Vue.use(VueRouter)

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

var router = new VueRouter()
router.map({
  '/': {
    component: Home
  },
  '/browser': {
    component: Browser
  }
})

router.start(App, '#container')
