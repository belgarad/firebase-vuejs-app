import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import router from './router'
import {
  store
} from './store'
import firebase from 'firebase'
import {
  firebaseConfig
} from './config/config'

Vue.use(Vuetify)
Vue.config.productionTip = false

firebase.initializeApp(firebaseConfig)

const unsubscribe = firebase.auth()
  .onAuthStateChanged((firebaseUser) => {
    new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App),
      created() {
        store.dispatch('autoSignIn', firebaseUser)
      }
    })
    unsubscribe()
  })
