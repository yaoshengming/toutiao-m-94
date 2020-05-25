// 专门负责小函数以及vue中常用的过滤器及函数
export default {
  // 提示消息设置为800毫秒
  install (Vue) {
    Vue.prototype.$ynotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
  }
}
