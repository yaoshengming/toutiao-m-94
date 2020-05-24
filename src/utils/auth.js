// 专门处理token的读写和删除
const USER_TOKEN = 'toutiao-m-94'// 专门用来存储用户信息
// 设置用户的token信息
export function setUser (user) {
  // user是一个对象 对象要转化成字符串
  window.localStorage.setItem(USER_TOKEN, JSON.stringify(user))
}
// 获取用户的token信息
export function getUser () {
  return JSON.parse(window.localStorage.getItem(USER_TOKEN) || '{}')
}// 将字符串转化为对象再返回 如果前面为true 后面不执行 如果前面为false 后面才执行
// 删除用户的token信息
export function delUser () {
  localStorage.removeItem(USER_TOKEN)
}
