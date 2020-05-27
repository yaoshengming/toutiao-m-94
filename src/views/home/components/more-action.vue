<template>
  <div class="more-action">
    <van-cell-group v-if="!isReport">
        <!-- 子组件传给父组件home/index 中more-action -->
      <van-cell  @click="$emit('dislike')">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <!-- 举报文章注册点击事件 -->
      <van-cell  @click="$emit('reportArticle',item.value)" v-for="item in reports" :key="item.value">{{item.label}}</van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { reports } from '@/api/constants'
import eventbus from '@/utils/eventbus'
export default {
  data () {
    return {
      isReport: false,
      reports
    }
  },
  // 举报文章 点击内容之后 需要初始化页面
  created () {
    // 一初始化就要开始监听 只要你一开始删除 就把弹层组件中反馈重置为初始状态
    eventbus.$on('delArticle', () => (this.isReport = false))
  }
}
</script>

<style lang='less' scoped>
.more-action {
  border-radius: 4px;
}
</style>
