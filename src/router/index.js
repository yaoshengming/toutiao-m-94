import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 按需加载配置路由
const Layout = () => import('@/views/layout')// 按需引入layout
const home = () => import('@/views/home')// 按需引入home 二级路由
const question = () => import('@/views/question')// 按需引入question 二级路由
const video = () => import('@/views/video')// 按需引入video 二级路由
const user = () => import('@/views/user')// 按需引入user 二级路由
// 其他一级路由
const chat = () => import('@views/user/chat')// 小智同学
const login = () => import('@views/user/login')// 登录
const profile = () => import('@views/user/profile')// 编辑资料
const search = () => import('@views/user/search')// 搜索中心
const searchresult = () => import('@views/user/result')// 搜索结果
const article = () => import('@views/user/article')// 文章详情
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Layout, // 布局组件 一级路由
    children: [{
      path: '',
      component: home
    }, {
      path: '/question',
      component: question// 问答组件
    }, {
      path: '/video',
      component: video// 视频组件
    }, {
      path: '/user',
      component: user
    }]
  }, {
    path: '/user/chat',
    component: chat// 一级路由小智同学
  },
  {
    path: '/login',
    component: login // 一级路由 登录
  },
  {
    path: '/user/profile',
    component: profile// 一级路由编辑资料
  },
  {
    path: '/search',
    component: search// 一级路由 搜索中心
  },
  {
    path: '/search/result',
    component: searchresult // 一级路由搜索中心
  },
  {
    path: '/user/article',
    component: article // 一级路由 文章详情
  }
]

const router = new VueRouter({
  routes
})

export default router
