import Vue from 'vue'
import Electron from 'vue-electron'
import unhandled from 'electron-unhandled'
import 'bulma/css/bulma.css'

import './assets/style/main.sass'
import './assets/style/animations.sass'
import './assets/fontawesome/css/fontawesome-all.css'

import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.config.devtools = true

Vue.use(Electron)
unhandled()

/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

/* Enable webpack hot reloading */
if (module.hot) {
  module.hot.accept()
}
