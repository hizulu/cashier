import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './routes.js'
import VueHtmlToPaper from 'vue-html-to-paper';
// import moment from 'moment-timezone'
const moment = require('moment')
require('moment/locale/es')

var moneyformat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css'
  ]
}

Vue.use(VueHtmlToPaper, options);

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