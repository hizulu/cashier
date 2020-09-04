import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './routes.js'
// import moment from 'moment-timezone'
const moment = require('moment')
require('moment/locale/es')

Vue.use(require('vue-moment'), {
  moment
})

Vue.config.productionTip = false
new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')