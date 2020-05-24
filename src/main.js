import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'// 完整引入vant
import 'vant/lib/index.css'// 引入vant组件的样式
import 'amfe-flexible'
Vue.use(Vant)// 注册使用
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
