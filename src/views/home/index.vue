<template>
  <div class="container">
    <van-tabs>
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <!-- <div class="scroll-wrapper"> -->
          <!-- <van-cell-group >
            <van-cell  title="标题" value="内容" v-for="item in 20" :key="item" ></van-cell>
          </van-cell-group> -->
        <!-- </div> -->
         <ArticleList  @showMoreAction="openMoreAction"   :channel_id="item.id"></ArticleList>
      </van-tab>
    </van-tabs>
      <!-- 在tabs下放置图标  编辑频道的图标 -->
      <span class="bar_btn">
        <!-- 放入图标 vant图标 -->
         <van-icon name='wap-nav'></van-icon>
      </span>
      <!-- 弹层组件 -->
      <van-popup   :style="{ width: '80%' }" v-model="showMoreAction">
      <more-action ></more-action>
    </van-popup>
  </div>
</template>

<script>
// @ is an alias to /src
import ArticleList from './components/article-list'
import { getMyChannels } from '@/api/channels'
import MoreAction from './components/more-action'// 在父组件引入MoreAction
export default {
  name: 'Home',
  components: {
    ArticleList,
    MoreAction
  },
  data () {
    return {
      channels: [], // 接收频道数据
      showMoreAction: false, // 是否显示弹层 当点击时才要显示所以默认为false
      articleId: null// 文章id
    }
  },
  methods: {
    // artId接收文章id
    openMoreAction (artId) {
      this.showMoreAction = true
      this.articleId = artId
    },
    async getMyChannels () {
      const data = await getMyChannels()// 接收返回的数据结果
      this.channels = data.channels// 将数据赋值给data中的数据
    }
  },
  // 直接获取频道数据
  created () {
    this.getMyChannels()
  }
}
</script>
<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;

  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;

    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
