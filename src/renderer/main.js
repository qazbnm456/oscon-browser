import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Electron from 'vue-electron'
import unhandled from 'electron-unhandled'
import { Autocomplete } from 'element-ui';
import 'bulma/css/bulma.css'

import './assets/style/main.sass'
import './assets/style/animations.sass'
import './assets/fontawesome/css/fontawesome-all.css'

import App from './App'
import router from './router'
import store from '../store/renderer'

Vue.config.productionTip = false
Vue.config.devtools = true

Vue.use(Electron)
Vue.use(VueI18n)
unhandled()

/* Create VueI18n instance with options */
const i18n = new VueI18n({
  /* Set locale */
  locale: 'en',
  /* Ready translated locale messages */
  messages: {
    en: {
      functions: {
        home: 'Home',
        back: 'Back',
        forward: 'Forward',
        reload: 'Reload'
      }
    },
    zhTW: {
      functions: {
        home: '首頁',
        back: '上一頁',
        forward: '下一頁',
        reload: '重整'
      }
    }
  }
})


// Customize Autocomplete component to match out needs
const reusableAutocomplete = Vue.extend(Autocomplete)
const customAutocomplete = reusableAutocomplete.extend({
  methods: {
    getData() {
      this.suggestions = [
        { value: 'OSCON' }
      ]
    }
  }
})
Vue.component('custom-autocomplete', customAutocomplete)

/* eslint-disable no-new */
new Vue({
  i18n,
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
