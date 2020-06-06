// 专门处理vuex中的模块
import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'
// 引入默认对象

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: auth.getUser(), // user就是我们的token信息的对象 如果缓存有token 读取缓存数据getUser
    photo: null// 用户头像
  },
  mutations: {
    // 修改token
    updateUser (state, payload) {
      state.user = payload.user// 定义载荷中的user数据给state
      auth.setUser(payload.user)// 保持vuex和本地缓存的同步  更新vuex时  也应该将最新的数据 存入本地缓存
    },
    // 2、删除token
    delUser (state) {
      state.user = {}// 将vuex中的token设置为空对象
      auth.delUser()// 缓存数据更新 删除本地缓存中的token
    },
    // 更新用户头像
    Photo (state, payload) {
      state.photo = payload.photo// 在载荷中传入photo
    }
  },

  actions: {
  },
  modules: {
  }
})
