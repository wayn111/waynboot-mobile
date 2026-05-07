import { defineAsyncComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  // 首页
  {
    path: '/:pathMatch(.*)*',
    name: 'Home',
    // 路由懒加载：https://router.vuejs.org/zh/guide/advanced/lazy-loading.html
    // webpackPreload：https://www.jianshu.com/p/bbdcfeee7fbc
    component: defineAsyncComponent(() => import('@/views/home/index.vue')),
    meta: {
      title: '首页',
      showTab: true,
      keepAlive: true
    }
  },
  // 登录
  {
    path: '/login',
    name: 'Login',
    component: defineAsyncComponent(() => import('@/views/auth/login.vue')),
    meta: {
      title: '登录'
    }
  },
  // 注册
  {
    path: '/registry',
    name: 'Registry',
    component: defineAsyncComponent(() => import('@/views/auth/registry.vue')),
    meta: {
      title: '注册'
    }
  },
  // 分类
  {
    path: '/category',
    name: 'Category',
    component: defineAsyncComponent(
      () => import('@/views/category/index.vue')
    ),
    meta: {
      title: '分类',
      showTab: true,
      keepAlive: true
    }
  },
  // 购物车
  {
    path: '/cart',
    name: 'Cart',
    component: defineAsyncComponent(() => import('@/views/cart/index.vue')),
    meta: {
      title: '购物车',
      showTab: true
    }
  },
  // 我的
  {
    path: '/user',
    name: 'User',
    component: defineAsyncComponent(() => import('@/views/user/index.vue')),
    meta: {
      title: '我的',
      showTab: true
    }
  },
  // 用户设置
  {
    path: '/userSetting',
    name: 'UserSetting',
    component: defineAsyncComponent(
      () => import('@/views/userSetting/index.vue')
    ),
    meta: {
      title: '用户设置',
      showTab: true
    }
  },
  // 用户设置-昵称
  {
    path: '/userSetting/nickname',
    name: 'UserSetNickname',
    component: defineAsyncComponent(
      () => import('@/views/userSetting/nickname/index.vue')
    ),
    meta: {
      title: '设置昵称',
      showTab: true
    }
  },
  // 用户设置-生日
  {
    path: '/userSetting/birthday',
    name: 'UserSetBirthday',
    component: defineAsyncComponent(
      () => import('@/views/userSetting/birthday/index.vue')
    ),
    meta: {
      title: '设置生日',
      showTab: true
    }
  },
  // 用户设置-性别
  {
    path: '/userSetting/gender',
    name: 'UserSetGender',
    component: defineAsyncComponent(
      () => import('@/views/userSetting/gender/index.vue')
    ),
    meta: {
      title: '设置性别',
      showTab: true
    }
  },
  // 用户设置-邮箱
  {
    path: '/userSetting/email',
    name: 'UserSetEmail',
    component: defineAsyncComponent(
      () => import('@/views/userSetting/email/index.vue')
    ),
    meta: {
      title: '设置邮箱',
      showTab: true
    }
  },
  // 用户设置-手机
  {
    path: '/userSetting/mobile',
    name: 'UserSetMobile',
    component: defineAsyncComponent(
      () => import('@/views/userSetting/mobile/index.vue')
    ),
    meta: {
      title: '设置手机号',
      showTab: true
    }
  },
  // 用户设置-密码
  {
    path: '/userSetting/password',
    name: 'UserSetPassword',
    component: defineAsyncComponent(
      () => import('@/views/userSetting/password/index.vue')
    ),
    meta: {
      title: '设置密码',
      showTab: true
    }
  },
  // 订单列表
  {
    path: '/user/order/list/:active',
    name: 'OrderList',
    props: true,
    component: defineAsyncComponent(
      () => import('@/views/order/list/index.vue')
    ),
    meta: {
      title: '订单列表',
      showTab: true
    }
  },
  // 商品列表
  {
    path: '/product/:categoryLevel/:cateId',
    name: 'Product',
    props: true,
    component: defineAsyncComponent(
      () => import('@/views/product/index.vue')
    ),
    meta: {
      title: '商品列表',
      keepAlive: true
    }
  },
  // 金刚位跳转商品列表
  {
    path: '/diamondGoodsList/:diamondId',
    name: 'Diamand',
    props: true,
    component: defineAsyncComponent(
      () => import('@/views/diamondGoodsList/index.vue')
    ),
    meta: {
      title: '商品列表',
      keepAlive: true
    }
  },
  // 商品详情
  {
    path: '/detail/:goodsId',
    name: 'Detail',
    props: true,
    component: defineAsyncComponent(
      () => import('@/views/detail/index.vue')
    ),
    meta: {
      title: '商品详情',
      keepAlive: true
    }
  },
  // 商品评论
  {
    path: '/detail/comment/:goodsId/:tagType',
    name: 'Comment',
    props: true,
    component: defineAsyncComponent(
      () => import('@/views/detail/comment/index.vue')
    ),
    meta: {
      title: '商品评论'
    }
  },
  // 地址管理
  {
    path: '/address',
    name: 'Address',
    component: defineAsyncComponent(
      () => import('@/views/address/list.vue')
    ),
    meta: {
      title: '地址管理'
    }
  },
  // 地址编辑
  {
    path: '/address/edit',
    name: 'AddressEdit',
    component: defineAsyncComponent(
      () => import('@/views/address/edit.vue')
    ),
    meta: {
      title: '地址编辑'
    }
  },
  // 搜索
  {
    path: '/search',
    name: 'Search',
    component: defineAsyncComponent(
      () => import('@/views/search/index.vue')
    ),
    meta: {
      title: '搜索'
    }
  },
  // 搜索结果
  {
    path: '/search/list',
    name: 'SearchList',
    component: defineAsyncComponent(
      () => import('@/views/search/list.vue')
    ),
    meta: {
      title: '搜索结果'
    }
  },
  // 确认订单
  {
    path: '/order/confirm',
    name: 'OrderConfirm',
    component: defineAsyncComponent(
      () => import('@/views/order/confirm/index.vue')
    ),
    meta: {
      title: '确认订单',
      keepAlive: true
    }
  },
  // 订单支付
  {
    path: '/order/pay',
    name: 'OrderPay',
    component: defineAsyncComponent(
      () => import('@/views/order/pay/index.vue')
    ),
    meta: {
      title: '订单支付'
    }
  },
  // 订单详情
  {
    path: '/order/detail/:orderSn',
    name: 'OrderDetail',
    props: true,
    component: defineAsyncComponent(
      () => import('@/views/order/detail/index.vue')
    ),
    meta: {
      title: '订单详情'
    }
  },
  // 支付状态
  {
    path: '/order/payStatus',
    name: 'PayStatus',
    props: true,
    component: defineAsyncComponent(
      () => import('@/views/order/payStatus/index.vue')
    )
  },
  // 优惠券
  {
    path: '/order/coupon',
    name: 'coupon',
    component: defineAsyncComponent(
      () => import('@/views/order/coupon/index.vue')
    ),
    meta: {
      title: '领券中心',
      showTab: true
    }
  },
  // 优惠券
  {
    path: '/order/my',
    name: 'couponMy',
    component: defineAsyncComponent(
      () => import('@/views/order/my/page.vue')
    ),
    meta: {
      title: '我的优惠券',
      showTab: true
    }
  },
  // 评论页面
  {
    path: '/goodsComment/:orderGoodsId/:goodsId',
    name: 'GoodsComment',
    props: true,
    component: defineAsyncComponent(
      () => import('@/views/goodsComment/index.vue')
    ),
    meta: {
      title: '商品评论'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  // 记录上个页面的滚动位置
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    return { top: 0, left: 0 }
  },
  routes
})

export default router
