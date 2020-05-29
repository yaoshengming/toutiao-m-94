<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <!-- 搜索组件 -->
    <van-search  @search="onSearch" v-model.trim="q"    placeholder="请输入搜索关键词" shape="round" />
    <!-- 联想内容 -->
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell icon="search">
        <span>j</span>ava
      </van-cell>
    </van-cell-group>
    <!-- 历史记录部分 你搜索的内容 会在这里记录 -->
    <div class="history-box" v-else>
      <div class="head"  v-if="history.length">
        <span>历史记录</span>
        <!-- @click="clear"清空历史记录 -->
        <van-icon  @click="clear" name="delete"></van-icon>
      </div>
      <van-cell-group>
        <!-- 需要把这个位置变成动态的{{item}} -->
         <!-- @click="toSearchResult(text)"点击历史记录时  跳到搜索结果 -->
        <van-cell  @click="toSearchResult(item)"  v-for="(item,index) in history"  :key="index" >
          <a class="word_btn">{{item}}</a>
          <!-- 叉号 点击注册事件删除-->
          <van-icon  @click="delhistory(index)"   class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { suggest } from '@/api/articles'
const key = 'toutiao-history'// 此key用来作为历史记录在本地缓存中的keys
export default {
  name: 'search',
  data () {
    return {
      q: '', // 关键词的
      // 当data初始化时  会读取后面数据
      history: JSON.parse(localStorage.getItem(key) || '[]'), // 作为一个数据变量 接收历史记录
      suggest: []// 搜索联想建议
    }
  },
  // 节流
  watch: {
    q () {
      if (!this.timer) {
        // 要求三百毫秒执行一次
        this.timer = setTimeout(async () => {
          this.timer = null// 现将标记设置为空
          // 需要判断 当清空的时候 不能发送请求 但是要把联想的建议清空
          if (!this.q) {
            // 如果这时 搜索关键字没有内容
            this.suggest = []
            // 不能继续了
            return
          }
          // 此函数中需要 请求联想搜索建议
          // 联想搜索的建议 需要房子在一个变量中
          const data = await suggest({ q: this.q })
          this.suggest = data.options// 将返回的词条的options赋值给当前的联想建议
        }, 300)
      }
    }
  },
  methods: {
    delhistory (index) {
      this.history.splice(index, 1)
      // 将数据同步到本地缓存
      localStorage.setItem(key, JSON.stringify(this.history))
    },
    // 跳到搜索结果页
    toSearchResult (text) {
      // 搜索记录应该保存在历史记录里
      this.history = Array.from(new Set(this.history))// 去重
      localStorage.setItem(key, JSON.stringify(this.history))// 设置到本地缓存中
      // 将历史记录设置到缓存
      // 跳转到搜索结果
      this.$router.push({ path: '/search/result?q=' + text })// 采用query传递参数 地址拼接参数
    },
    // 清空历史记录的方法
    async clear () {
      try {
        // $dialog  vant中的
        await this.$dialog.confirm({
          title: '提示',
          message: '您确定要清空所有历史记录吗'
        })
        this.history = []// 清空历史数据
        localStorage.setItem(key, '[]')// 同步设置历史记录为空
      } catch (error) {
        // 失败不需要处理
      }
    },
    // 搜索按钮 回车或者虚拟键盘搜索=>搜索事件
    onSearch () {
      // 首先判断的搜索内容为空 为空 直接返回
      if (!this.q) return

      // 应该在跳转之前 把搜索的结果  添加到历史记录 这里要去重
      this.history.push(this.q)// 将搜索内容化加入到历史记录
      this.history = Array.from(new Set(this.history))// 去重
      localStorage.setItem(key, JSON.stringify(this.history))// 设置到本地缓存
      // 搜索事件触发的时候 应该跳到搜索结果页 并且携带参数
      this.$router.push({ path: '/search/result', query: { q: this.q } })
    }
  }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
