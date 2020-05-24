<template>
  <div class="container">
    <!--vant导航栏van-nav-bar fixed固定在顶部 @click-right点击事件-->
    <van-nav-bar   @click-right="$router.push('/search')"  v-if="$route.path!=='/user'" fixed title="顶呱呱头条" right-text="搜索"></van-nav-bar>
    <!-- 二级路由容器 -->
    <div :class="{noTop:$route.path==='/user'}">
      <router-view></router-view>
    </div>
    <!-- 标签栏组件 route表示开启路由模式-->
    <van-tabbar route>
      <van-tabbar-item icon="wap-home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="question-o" to="/question">问答</van-tabbar-item>
      <van-tabbar-item icon="video-o" to="/video" >视频</van-tabbar-item>
      <van-tabbar-item icon="user-circle-o"  to="/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {}
</script>

<style  lang="less" scoped >
.container {
  width: 100%;
  height: 100%;
  position: relative;
  //控制二级路由容器的高宽
  .my-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop {
      padding-top: 0;
    }
  }
}
</style>
