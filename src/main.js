import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VCharts from 'v-charts'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/base.css'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'


Vue.use(VueVideoPlayer)
Vue.use(ElementUI)
Vue.use(VCharts)

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')