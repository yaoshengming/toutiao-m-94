// 请求管理工具
import axios from 'axios'
import JSONBig from 'json-bigint'// 引入大数字
import { Store } from 'vuex'
import store from '@/store'// 引入vuex中的store实例对象 相当于组件中的this.$store
// axios.defaults对原有默认值进行修改
const instance = axios.create({
// 构造参数 传入一些配置
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 基础请求地址
  transformResponse: [function (data) {
    //   data 就是后端响应回来的字符串 把原来的JSON.parse()转换成大数字JSONBig.parse（）
    return data ? JSONBig.parse(data) : {}
  }]
})// 创建一个axios实例
// token的注入  应该在请求之前 也就是请求拦截器 里面有两个回调  一个成功 一个失败
instance.interceptors.request.use(function (config) {
// 成功时 应该读取配置信息 给配置信息中注入token
  if (Store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`// 将token统一注入到headers中
    return config// 返回配置
  }
}, function (error) {
// 直接返回promise的错误
  return Promise.reject(error)// 返回错误 这样的话就会直接进入到axios的cath中
})
// axios默认给我们的数据加了一层data 需要解构
// 用响应拦截器处理返回结果的数据 将多嵌套的结构 解构出来
instance.interceptors.response.use(function (response) {
  try {
    return response.data.data// 如果成功返回 两层可以解开 就返回两层
  } catch (error) {
    return response.data// 如果失败 就先返回一层
  }
}, function (error) {
  // 最后失败 直接返回
  return Promise.reject(error)// 返回执行链的catch
})
export default instance // 导出
