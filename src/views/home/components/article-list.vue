<template>
  <!-- 放置div 是为了阅读记忆 形成滚动条 -->
  <div class="scroll-wrapper">
    <!-- :finished="finished"把属性赋值 -->
    <!-- van-list组件如果不加干涉 初始化完毕 就会检测 自己距离底部的长度,
    如果超过了限定 ,就会执行 load事件  自动把绑定的 loading 变成true-->
    <!-- van-pull-refresh下拉刷新 -->
    <van-pull-refresh v-model="isLoading" :success-text="successText" @refresh="onRefresh">
      <van-list v-model="upLoading" :finished="finished" finished-text="我是有底线的" @load="onLoad">
        <van-cell-group>
          <!-- 循环内容 item.art_id是对象 应该用toString来处理大数字-->
          <van-cell v-for="item in article" :key="item.art_id.toString()">
            <!-- 列表文章布局 -->
            <!-- 标题 -->
            <div class="article_item">
              <h3 class="van-ellipsis">{{item.title}}</h3>
              <!-- 三图模式 lazy-load懒加载-->
              <div class="img_box" v-if="item.cover.type===3">
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <!-- 单图模式 -->
              <div class="img_box" v-if="item.cover.type===1">
                <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>
              <!-- 作者 -->
              <div class="info_box">
                <span>{{item.aut_name}}</span>
                <span>{{item.comm_count}}</span>
                <span>{{item.pubdate | relTime}}</span>
                <!-- 小叉号显示弹层 用户登录才显示小叉号  item.art_id.toString()传入文章id-->
                <span class="close" @click="$emit('showMoreAction',item.art_id.toString())" v-if="$store.state.user.token" >
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/articles'
import eventbus from '@/utils/eventbus'// 不感兴趣 删除对应文章 先引入eventbus
export default {
  // 不感兴趣 监听删除文章事件
  // 初始化函数 传递两个参数文章id和频道id artId, channelId
  created () {
    eventbus.$on('delArticle', (artId, channelId) => {
      // eventbus.$on会触发所有实例所以 进行 判断传递过来的频道是否等于自身频道
      if (channelId === this.channel_id) {
        // 先找到频道id对应的索引
        const index = this.article.findIndex(item => item.art_id.toString() === artId)
        if (index > -1) {
          this.article.splice(index, 1)// 删除对应下标的数据
        }
        // 可是你一直删除 会将数据都删光 就不会触发load事件
        // 需要手动触发onload 给页面加载数据
        if (this.article.length === 0) {
        }
        this.onLoad()
      }
    })
  },
  data () {
    return {
      successText: '', // 刷新成功的文本
      isLoading: false, // 下拉刷新状态 表示是否正在下拉刷新
      upLoading: false, // 表示是否开启了上拉加载 默认值false
      finished: false, // 表示是否已经完成所有数据的加载
      article: [], // 文章列表
      timestamp: null // 事件戳
    }
  },
  props: {
    channel_id: {
      required: true, // true必传值
      type: Number, // 传入的props类型
      default: null // 没有传入props时  默认
    }
  },
  methods: {
    //   上拉加载
    async onLoad () {
      console.log('开始加载文章列表数据')
      await this.$sleep()
      // van-list组件如果不加干涉 初始化完毕 就会检测 自己距离底部的长度,如果超过了限定 ,就会执行 load事件自动把 绑定的 loading 变成true
      // 设置setTimeout 为了手动关闭加载
      //   setTimeout(() => {
      //     this.finished = true// 表示数据已经全部加载完毕 没有数据 所以执行一秒钟关闭上拉加载
      //   }, 1000)
      // if (this.article.length > 50) {
      //   this.finished = true // 没有数据了  就不加载了
      // } else {
      //   const arr = Array.from(
      //     Array(15),
      //     (value, index) => this.article.length + index + 1
      //   )
      //   this.article.push(...arr) // 上拉加载  不是覆盖之前的数据 应该把数据追加到数组的队尾
      //   this.upLoading = false // 添加完数据  手动关闭
      // }
      // this.timestamp || Date.now()  如果有历史时间戳 用历史时间戳 否则用当前的时间戳
      const data = await getArticles({
        channel_id: this.channel_id,
        timestamp: this.timestamp || Date.now()
      })
      this.article.push(...data.results) // 需要将数据一项一项追加到队尾 所以是。。。
      this.upLoading = false // 关闭加载状态
      if (data.pre_timestamp) {
        // 将历史时间戳给timestamp但是赋值之前有个判断 需要判断一个历史时间是否为0
        // 如果有历史时间戳为0 说明此时已经没有数据了 应该宣布结束finished true
        this.timestamp = data.pre_timestamp // 如果有历史时间戳 表示还有数据可以继续进行加载
      } else {
        this.finished = true // 表示没有数据可以继续加载
      }
    },
    // 下拉刷新
    async onRefresh () {
      await this.$sleep()
      const data = await getArticles({
        channel_id: this.channel_id,
        timestamp: Date.now()
      }) // 时间戳一直是最新的数据
      this.isLoading = false // 手动关闭下拉刷新的状态
      if (data.results.length) {
        this.article = data.results // 历史数据全部被覆盖
        if (data.pre_timestamp) {
          // 此时你 已经之前的全部数据覆盖了 假如 你之前把数据拉到了低端 也就意味着 你之前的finished已经为true了
          this.finished = false // 下拉加载 换来新数据 里面又有历史时间戳 需要重新唤醒列表 让列表可以继续上拉加载
          this.timestamp = data.pre_timestamp // 记录历史时间戳
        }
        this.successText = `更新了${data.results.length}条数据`
      } else {
        // 如果没有新数据
        this.successText = '当前已经是最新了'
      }
      // setTimeout(() => {
      //   const arr = Array.from(
      //     Array(2),
      //     (value, index) => '追加' + (index + 1)
      //   )
      //   this.article.unshift(...arr)
      //   this.isLoading = false
      //   this.successText = `更新了${arr.length}条数据`
      // }, 1000)
    }
  }
}
</script>

<style  lang="less"  scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
