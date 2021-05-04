import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 首页
  {
    path: '*',
    name: 'Home',
    // 路由懒加载：https://router.vuejs.org/zh/guide/advanced/lazy-loading.html
    // webpackPreload：https://www.jianshu.com/p/bbdcfeee7fbc
    component: () => import(/* webpackPreload: true */ '@/views/home'),
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
    component: () => import('@/views/auth/login'),
    meta: {
      title: '登录'
    }
  },
  // 注册
  {
    path: '/registry',
    name: 'Registry',
    component: () => import('@/views/auth/registry'),
    meta: {
      title: '注册'
    }
  },
  // 分类
  {
    path: '/category',
    name: 'Category',
    component: () => import('@/views/category'),
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
    component: () => import('@/views/cart'),
    meta: {
      title: '购物车',
      showTab: true
    }
  },
  // 我的
  {
    path: '/user',
    name: 'User',
    component: () => import('@/views/user'),
    meta: {
      title: '我的',
      showTab: true
    }
  },
  // 用户设置
  {
    path: '/userSetting',
    name: 'UserSetting',
    component: () => import('@/views/userSetting'),
    meta: {
      title: '用户设置',
      showTab: true
    }
  },
  // 用户设置-昵称
  {
    path: '/userSetting/nickname',
    name: 'UserSetNickname',
    component: () => import('@/views/userSetting/nickname'),
    meta: {
      title: '设置昵称',
      showTab: true
    }
  },
  // 用户设置-生日
  {
    path: '/userSetting/birthday',
    name: 'UserSetBirthday',
    component: () => import('@/views/userSetting/birthday'),
    meta: {
      title: '设置生日',
      showTab: true
    }
  },
  // 用户设置-性别
  {
    path: '/userSetting/gender',
    name: 'UserSetGender',
    component: () => import('@/views/userSetting/gender'),
    meta: {
      title: '设置性别',
      showTab: true
    }
  },
  // 用户设置-邮箱
  {
    path: '/userSetting/email',
    name: 'UserSetEmail',
    component: () => import('@/views/userSetting/email'),
    meta: {
      title: '设置邮箱',
      showTab: true
    }
  },
  // 用户设置-手机
  {
    path: '/userSetting/mobile',
    name: 'UserSetMobile',
    component: () => import('@/views/userSetting/mobile'),
    meta: {
      title: '设置手机号',
      showTab: true
    }
  },
  // 用户设置-密码
  {
    path: '/userSetting/password',
    name: 'UserSetPassword',
    component: () => import('@/views/userSetting/password'),
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
    component: () => import('@/views/order/list'),
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
    component: () => import('@/views/product'),
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
    component: () => import('@/views/diamondGoodsList'),
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
    component: () => import('@/views/detail'),
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
    component: () => import('@/views/detail/comment'),
    meta: {
      title: '商品评论'
    }
  },
  // 地址管理
  {
    path: '/address',
    name: 'Address',
    component: () => import('@/views/address/list'),
    meta: {
      title: '地址管理'
    }
  },
  // 地址编辑
  {
    path: '/address/edit',
    name: 'AddressEdit',
    component: () => import('@/views/address/edit'),
    meta: {
      title: '地址编辑'
    }
  },
  // 搜索
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/search'),
    meta: {
      title: '搜索'
    }
  },
  // 搜索结果
  {
    path: '/search/list',
    name: 'SearchList',
    component: () => import('@/views/search/list'),
    meta: {
      title: '搜索结果'
    }
  },
  // 确认订单
  {
    path: '/order/confirm',
    name: 'OrderConfirm',
    component: () => import('@/views/order/confirm'),
    meta: {
      title: '确认订单',
      keepAlive: true
    }
  },
  // 订单支付
  {
    path: '/order/pay',
    name: 'OrderPay',
    component: () => import('@/views/order/pay'),
    meta: {
      title: '订单支付'
    }
  },
  // 支付状态
  {
    path: '/order/payStatus',
    name: 'PayStatus',
    props: true,
    component: () => import('@/views/order/payStatus')
  },
  // 评论页面
  {
    path: '/goodsComment/:orderGoodsId/:goodsId',
    name: 'GoodsComment',
    props: true,
    component: () => import('@/views/goodsComment'),
    meta: {
      title: '商品评论'
    }
  }
]

const router = new VueRouter({
  // 记录上个页面的滚动位置
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes
})

export default router
