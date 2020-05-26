<template>
  <!-- 放置div 是为了阅读记忆 形成滚动条 -->
  <div class="scroll-wrapper">
    <!-- :finished="finished"把属性赋值 -->
    <!-- van-list组件如果不加干涉 初始化完毕 就会检测 自己距离底部的长度,
    如果超过了限定 ,就会执行 load事件  自动把绑定的 loading 变成true-->
    <van-list v-model="upLoading" :finished="finished"   finished-text="我是有底线的" @load="onLoad">
      <van-cell-group>
          <!-- 循环内容 -->
      <van-cell title="你好" :value="`好`+item" v-for="item in article" :key="item"></van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      upLoading: false, // 表示是否开启了上拉加载 默认值false
      finished: false, // 表示是否已经完成所有数据的加载
      article: []// 文章列表
    }
  },
  methods: {
    onLoad () {
      console.log('开始加载数据')
      // van-list组件如果不加干涉 初始化完毕 就会检测 自己距离底部的长度,如果超过了限定 ,就会执行 load事件自动把 绑定的 loading 变成true
      // 设置setTimeout 为了手动关闭加载
      //   setTimeout(() => {
      //     this.finished = true// 表示数据已经全部加载完毕 没有数据 所以执行一秒钟关闭上拉加载
      //   }, 1000)
      if (this.article.length > 50) {
        this.finished = true// 没有数据了  就不加载了
      } else {
        const arr = Array.from(Array(15), (value, index) => this.article.length + index + 1)
        this.article.push(...arr)// 上拉加载  不是覆盖之前的数据 应该把数据追加到数组的队尾
        this.upLoading = false// 添加完数据  手动关闭
      }
    }
  }
}
</script>

<style>
</style>
