import Vue from 'vue'
import App from './App'

Vue.use(require('vue-resource'))
Vue.config.debug = true

/* eslint-disable no-new */
new Vue({
  el: 'body',
  components: { App }
})
