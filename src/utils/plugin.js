// 专门负责小函数以及vue中常用的过滤器及函数
export default {
  // 提示消息设置为800毫秒
  install (Vue) {
    Vue.prototype.$ynotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    Vue.prototype.$sleep = sleep
  }
}
// 延迟处理函数 控制数据频繁的下拉加载
function sleep (time = 500) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), time)
  })
}
