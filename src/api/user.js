// 专门处理用户相关的请求
// 导出一个登录方法
import request from '@/utils/request'
export function login (data) {
  return request({
    url: '/authorizations',
    method: 'post',
    // axios 的body参数 写在data中
    data// 接收传递的data data:data  es6简写data
  })
  // 返回一个promise对象
}
// 关注用户
export function followuser (data) {
  return request({
    url: '/user/followings',
    method: 'post',
    data
  })
}
// 取消关注
export function Nofollow (autid) {
  return request({
    url: `/user/followings/${autid}`,
    method: 'delete'

  })
}
