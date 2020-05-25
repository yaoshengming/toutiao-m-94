import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'// 完整引入vant
import plugin from '@/utils/plugin'
import 'vant/lib/index.less'// 引入vant组件的样式 这里用less 因为我们想修改某些变量
import 'amfe-flexible'
import '@/styles/index.less'// 引入全局的自定义样式  因为要覆盖vant的样式
Vue.use(Vant)// 注册使用
Vue.use(plugin)// 需要放在Vue.use(Vant)之后 必须等到vant注册完毕
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
