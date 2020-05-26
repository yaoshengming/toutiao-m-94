// 专门处理频道的请求
import request from '@/utils/request'// 引入request
// 导出我的频道方法 没有参数 匿名用户也可以获取数据
export function getMyChannels () {
  return request({
    url: '/user/channels'// 用户频道地址
  })
}
