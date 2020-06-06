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
// 获取用户自己信息
export function getUser () {
  return request({
    url: '/user'
  })
}
// 获取用户的个人资料
export function getUserProfile () {
  return request({
    url: '/user/profile'
  })
}
// 修改用户头像
export function updatePhoto (data) {
  return request({
    url: '/user/photo',
    method: 'patch',
    data// body参数
  })
}
// 保存用户信息
export function saveUser (data) {
  return request({
    url: '/user/profile',
    method: 'patch',
    data: { ...data, photo: null }// 直接将photo设置为空
  })
}
