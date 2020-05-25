<template>
  <div>
    <div class="container">
      <van-nav-bar title="登录" left-text="返回" @click-left="$router.go(-1)"></van-nav-bar>
      <van-cell-group>
        <!-- 输入手机号离开之后 触发校验@blur -->
        <van-field
          @blur="checkMobile"
          :error-message="errorMessage.mobile"
          v-model.trim="loginFrom.mobile"
          label="手机号"
          placeholder="请输入手机号"
        ></van-field>
        <van-field
          @blur="checkCode"
          :error-message="errorMessage.code"
          v-model.trim="loginFrom.code"
          label="验证码"
          placeholder="请输入验证码"
        >
          <van-button slot="button" size="small" type="primary">发送验证码</van-button>
        </van-field>
        <div class="login-box">
          <van-button @click="login" type="info" round size="small" block>登录</van-button>
        </div>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
// 引入login方法  login是平常方法import { login } from '@/api/user'
import { login } from '@/api/user'
import { mapMutations } from 'vuex'// 辅助函数
export default {
  data () {
    return {
      loginFrom: {
        mobile: '13911111111', // 写固定手机号方便测试
        code: '246810' // 方便测试
      },
      errorMessage: {
        mobile: '', // 手机号错误消息
        code: '' // 验证码错误消息
      }
    }
  },
  methods: {
    ...mapMutations(['updateUser']), // 辅助函数把store中updateUser方法映射到当前的methods中
    checkMobile () {
      if (!this.loginFrom.mobile) {
        this.errorMessage.mobile = '手机号不能为空'
        return false
      }
      if (!/^1[3-9]\d{9}$/.test(this.loginFrom.mobile)) {
        this.errorMessage.mobile = '手机号格式不正确'
        return false
      }
      // 校验成功
      this.errorMessage.moblie = ''
      return true
    },
    checkCode () {
      if (!this.loginFrom.code) {
        this.errorMessage.code = '验证码不能为空'
        return false
      }
      if (!/^\d{6}$/.test(this.loginFrom.code)) {
        this.errorMessage.code = '验证码应该为6位数'
        return false
      }
      // 校验成功
      this.errorMessage.code = ''
      return true
    },
    // 登录校验
    async  login () {
      if (this.checkMobile() && this.checkCode()) {
        // console.log('校验通过')
        try {
          const result = await login(this.loginFrom)
          // 拿到token之后 应该把token设置vuex中的state
          // 修改vuex中的state必须通过mutations 原生写法this.$store.commit('')
          // user是store中的载荷 也就是token和refresh_token
          this.updateUser({ user: result })// 更新了当前的token和refresh_token
          // 应该返回页面（跳转过来的那一页）
          // 判断是否有跳转的页面 如果有 就跳转 如果没有直接跳转到主页
          // route路由信息
          const { redirectUrl } = this.$route.query// 接收query参数
          this.$router.push(redirectUrl || '/')// 短路表达式
        } catch (error) {
          // 提示信息this.$notify是vant组件库中的提示信息 duration时间弹出设置
          this.$notify({ message: '用户名或者验证码错误', duration: 800 })
        }
      }
    }
  }
}
</script>

<style>
.login-box {
  padding: 20px;
}
</style>
