// 专门处理频道的请求
import store from '@/store'
import request from '@/utils/request'// 引入request
const LOGIN_V = 'toutiao-v'// 登录用户的key
const LOGIN_N = 'toutiao-n'// 游客用户的key
// 导出我的频道方法 没有参数 匿名用户也可以获取数据
// export function getMyChannels () {
//   return request({
//     url: '/user/channels'// 用户频道地址
//   })
// }
// 对我的频道 进行改造  因为频道的编辑接口存在着一些问题
// 我们尝试将所有个人的频道 不论是登录还是没登录的 都进行本地化,什么意思呢
// 如果是游客, 第一次会查询到默认的频道,我们将这个默认频道 缓存到本地.,如果要修改 就可以修改本地的这个缓存, 那么以后进来的时候, 如果能确定游客身份, 就先去本地查频道 , 如果能查到 ,就用本地频道,否则查询线上频道
// 如果是登录用户, 第一次查到默认的频道也缓存到本地, 但是这个缓存 和游客的缓存区分,如果修改也修改本地的缓存,以后再次进来 ,就从缓存中先读取,如果 能读到,就用本地的,否则用查询的数据
// 我们要对 用户频道的数据进行本地化,先去查本地数据, 本地没有,去查线上数据, 查过来之后 线上数据缓存到本地
// 我们需要对获取个人频道的数据进行改造,
// 还需要注意,我们读取缓存数据的时候还需要 区分 游客和登录用户
// * 获取我的频道数据  没有参数 匿名用户也可以获取数据
// *  要将此方法 改造成 本地化的频道
export function getMyChannels () {
  return new Promise(function (resolve, reject) {
    // 有没有token来区分当前是登录用户还是游客
    const key = store.state.user.token ? LOGIN_V : LOGIN_N
    // 去缓存中读取 用户频道数据
    const str = localStorage.getItem(key)// 通过缓存key获取缓存中的用户频道数据
    if (str) {
      // 本地缓存有数据 应该把本地数据释放给后面的执行结果
      resolve({ channels: JSON.parse(str) })// 这里的结构和请求体中的结构一致
    } else {
      // 本地缓存没有数据  就要去线上拉取数据
      request({ url: '/user/channels' }).then(result => {
        localStorage.setItem(key, JSON.stringify(result.channels))
        // 这里还需要reslove我们的数据
        resolve(result)// 这里表示直接成功 执行了  获取用户频道数据
        // 频道数据  先把这个数据放入缓存
        // 得到线上的一个用户频道列表数据 先把这个数据放入缓存
      })
    }
  })
}
// 获取全部频道
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}
