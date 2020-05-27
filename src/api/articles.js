// 专门处理文章模块的请求列表
import request from '@/utils/request'
// 获取文章推荐数据
export function getArticles (params) {
  return request({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: { with_top: 1, ...params }
  })
}
// 不感兴趣文章
export function dislike (data) {
  return request({
    url: '/article/dislikes',
    method: 'post',
    data
  })
}
// 封装举报文章接口
export function reportArticle (data) {
  return request({
    url: '/article/reports',
    method: 'post',
    data
  })
}
