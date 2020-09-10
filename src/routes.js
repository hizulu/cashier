import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
import Cashier from './components/cashier/Index.vue'
import History from './components/history/Index.vue'
import DailyUpload from './components/dailyupload/Index.vue'
import Home from './components/Home.vue'
export default new VueRouter({
    mode: 'history',
    routes: [{
            path: '/kasir',
            name: 'kasir',
            component: Cashier
        },
        {
            path: '/riwayat-transaksi',
            name: 'riwayat-transaksi',
            component: History
        },
        {
            path: '/upload-transaksi-harian',
            name: 'upload-transaksi-harian',
            component: DailyUpload
        },
        {
            path: '/',
            name: 'home',
            component: Home
        }
    ]
})