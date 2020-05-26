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
          <!-- 循环内容 title="你好" :value="`好`+item"-->
          <van-cell v-for="item in article" :key="item">
            <!-- 列表文章布局 -->
             <!-- 标题 -->
            <div class="article_item">
              <h3 class="van-ellipsis">PullRefresh下拉刷新PullRefresh下拉刷新下拉刷新下拉刷新</h3>
              <!-- 三图模式 -->
              <div class="img_box">
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              </div>
              <!-- 单图模式 -->
              <!-- <div class="img_box">
      <van-image class="w100" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg"/>
              </div>-->
              <!-- 作者 -->
              <div class="info_box">
                <span>你像一阵风</span>
                <span>8评论</span>
                <span>10分钟前</span>
                <span class="close">
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
export default {
  data () {
    return {
      successText: '', // 刷新成功的文本
      isLoading: false, // 下拉刷新状态 表示是否正在下拉刷新
      upLoading: false, // 表示是否开启了上拉加载 默认值false
      finished: false, // 表示是否已经完成所有数据的加载
      article: [] // 文章列表
    }
  },
  methods: {
    //   上拉加载
    onLoad () {
      //   console.log('开始加载数据')
      // van-list组件如果不加干涉 初始化完毕 就会检测 自己距离底部的长度,如果超过了限定 ,就会执行 load事件自动把 绑定的 loading 变成true
      // 设置setTimeout 为了手动关闭加载
      //   setTimeout(() => {
      //     this.finished = true// 表示数据已经全部加载完毕 没有数据 所以执行一秒钟关闭上拉加载
      //   }, 1000)
      if (this.article.length > 50) {
        this.finished = true // 没有数据了  就不加载了
      } else {
        const arr = Array.from(
          Array(15),
          (value, index) => this.article.length + index + 1
        )
        this.article.push(...arr) // 上拉加载  不是覆盖之前的数据 应该把数据追加到数组的队尾
        this.upLoading = false // 添加完数据  手动关闭
      }
    },
    // 下拉刷新
    onRefresh () {
      setTimeout(() => {
        const arr = Array.from(
          Array(2),
          (value, index) => '追加' + (index + 1)
        )
        this.article.unshift(...arr)
        this.isLoading = false
        this.successText = `更新了${arr.length}条数据`
      }, 1000)
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
