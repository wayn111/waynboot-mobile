import router from './router'
import store from './store'
import { Toast } from 'vant'
import { getToken } from '@/utils/auth' // get token from cookie
import { pathMatcher } from '@/utils/index'

const whiteList = ['/login', '/registry', '/', '/index', '/category', '/detail/**', '/diamondGoodsList/**', '/search/**', '/order/coupon'] // 白名单

router.beforeEach(async(to, from, next) => {
  // 设置标题
  document.title = to.meta.title || 'panda-mall'

  // 根据token判断用户是否登录
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已经登录了，而去的又是login页就重定向到首页
      next({ path: '/' })
    } else {
      const hasUserInfo = store.getters.id
      if (hasUserInfo) {
        next()
      } else {
        // 如果用户刷新了浏览器，那么需要重新请求基本信息塞到vuex中进行状态管理
        try {
          await store.dispatch('user/getInfo')
          next()
        } catch (error) {
          if (pathMatcher(whiteList, to.path)) {
            next()
          } else {
            // 清空token重新去登录
            // await store.dispatch('user/resetToken')
            // next(`/login?redirect=${encodeURIComponent(location.href)}`)
          }
        }
      }
    }
  } else {
    if (pathMatcher(whiteList, to.path)) {
      console.log(to.path)
      next()
    } else {
      // 反之则去登录页面
      next(`/login?redirect=${encodeURIComponent(location.href)}`)
    }
  }
})

router.afterEach(() => {
  Toast.clear()
})
