<template>
  <div class="container">
    <!-- 不感兴趣 找到文章对应频道 -->
    <van-tabs v-model="activeIndex"  @change="changeTab">
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <!-- <div class="scroll-wrapper"> -->
        <!-- <van-cell-group >
            <van-cell  title="标题" value="内容" v-for="item in 20" :key="item" ></van-cell>
        </van-cell-group>-->
        <!-- </div> -->
        <ArticleList @showMoreAction="openMoreAction" :channel_id="item.id"></ArticleList>
      </van-tab>
    </van-tabs>
    <!-- 在tabs下放置图标  编辑频道的图标 -->
    <span class="bar_btn" @click="showChannelEdit= true">
      <!-- 放入图标 vant图标 -->
      <van-icon name="wap-nav"></van-icon>
    </span>
    <!-- 弹层组件 -->
    <van-popup :style="{ width: '80%' }" v-model="showMoreAction">
      <!-- 更多操作 不感兴趣 父组件监听来自home/components/more-action 中不感兴趣模块-->
      <MoreAction @reportArticle="reportArticle" @dislike="dislikeA"></MoreAction>
    </van-popup>
    <!-- 频道编辑组件 放在弹出面板的组件 -->
    <van-action-sheet v-model="showChannelEdit" title="编辑频道" :round="false">
      <!-- 放置频道编辑组件 -->
      <!-- :activeIndex="activeIndex"传值 这是做点击我的频道会显示点击的是这个频道 -->
      <ChannelEdit
        @del="del"
        :activeIndex="activeIndex"
        @selectchannels="selectchannels"
        :channels="channels"
        @addChannel="addChannel"
      ></ChannelEdit>
    </van-action-sheet>
  </div>
</template>

<script>
// @ is an alias to /src
import ArticleList from './components/article-list'
import { getMyChannels, delChannels, AddMychannels } from '@/api/channels'
import MoreAction from './components/more-action' // 在父组件引入MoreAction
import { dislike, reportArticle } from '@/api/articles'
import eventbus from '@/utils/eventbus'
import ChannelEdit from './components/channel-edit' // 引入编辑频道组件
export default {
  name: 'Home',
  components: {
    ArticleList,
    MoreAction,
    ChannelEdit
  },
  data () {
    return {
      channels: [], // 接收频道数据
      showMoreAction: false, // 是否显示弹层 当点击时才要显示所以默认为false
      articleId: null, // 文章id
      activeIndex: 0, // 不感兴趣 文章对应频道 默认为0
      showChannelEdit: false// 频道编辑 默认隐藏
    }
  },
  methods: {
    // 切换页签事件
    changeTab () {
      // 切换页签时 我要广播一个消息  让对应的页签中的文章列表 去滚动滚动条
      eventbus.$emit('changeTab', this.channels[this.activeIndex].id)
    },
    // 点击加号 增加我的频道
    async addChannel (channel) {
      await AddMychannels(channel)
      this.channels.push(channel)// 自身加一个频道 影响子组件
    },
    // 点击叉号 删除我的频道
    async  del (id) {
      // 调用delChannels方法
      try {
        await delChannels(id)// 调用api 此时只是删除了缓存中的数据
        // 如果此时成功的reslove 我们应该去引出当前data中的数据
        const index = this.channels.findIndex(item => item.id === id)
        // 找到对应的索引
        // 找到对应的索引之后 要根据当前删除的索引 当前激活的索引的关系来决定 当前激活索引是否需要改变
        if (index <= this.activeIndex) {
          // 如果你删除的索引 是在当前激活索引之前的  或者等于当前激活索引的
          // 此时就要把激活索引 给往前挪一位
          this.activeIndex = this.activeIndex - 1
        }
        this.channels.splice(index, 1)// 删除对应的索引频道
      } catch (error) {
        this.$ynotify({ message: '删除频道失败' })
      }
    },
    // 点击我的频道跳转到对应标签频道
    selectchannels (index) {
      this.activeIndex = index// 将对应频道的索引 设置给当前激活的标签
      this.showChannelEdit = false// 关闭弹层
    },
    // artId接收文章id
    openMoreAction (artId) {
      this.showMoreAction = true
      this.articleId = artId
    },
    async getMyChannels () {
      const data = await getMyChannels() // 接收返回的数据结果
      this.channels = data.channels // 将数据赋值给data中的数据
    },
    // 不感兴趣
    async dislikeA () {
      try {
        await dislike({
          target: this.articleId // 不感兴趣的id
        })
        this.$ynotify({
          type: 'success',
          message: '操作成功'
        })
        // 点击不感兴趣 删除对应文章 除了传入articleId 还需要对应频道
        // 应该触发一个事件  利用事件广播的机制 通知对应的tab 来删除文章
        // 然后跳转到子组件home/components/article-list进行监听
        // this.channels[this.activeIndex].id就是对应频道的id
        eventbus.$emit(
          'delArticle',
          this.articleId,
          this.channels[this.activeIndex].id
        )
        this.showMoreAction = false // 点击不感兴趣后自动关闭弹层
      } catch (error) {
        this.$ynotify({
          message: '操作失败'
        })
      }
    },
    // 举报文章
    async reportArticle (type) {
      try {
        await reportArticle({
          target: this.articleId,
          type
        })
        this.$ynotify({
          type: 'success',
          message: '操作成功'
        })
        eventbus.$emit(
          'delArticle',
          this.articleId,
          this.channels[this.activeIndex].id
        )
        this.showMoreAction = false // 点击不感兴趣后自动关闭弹层
      } catch (error) {
        this.$ynotify({
          message: '操作失败'
        })
      }
    }
  },
  // 直接获取频道数据
  created () {
    this.getMyChannels()
  }
}
</script>
<style lang="less" scoped>
// 编辑频道面板的样式
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
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
