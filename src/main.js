import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './routes.js'
// import moment from 'moment-timezone'
const moment = require('moment')
require('moment/locale/es')

var moneyformat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

Vue.use(require('vue-moment'), {
  moment
})

Vue.use(moneyformat)

Vue.config.productionTip = false
new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')