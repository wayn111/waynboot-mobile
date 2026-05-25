# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目简介

waynboot-mobile 是配套 waynboot-mall 后端的 Vue 3 H5 移动端商城，使用 Vite 6 构建，Vant 4 作为 UI 组件库，Vuex 4 管理状态。

## 常用命令

```bash
# 安装依赖
npm install

# 本地开发（端口 4949）
npm run dev

# 生产打包
npm run build:prod

# 开发环境打包
npm run build:dev

# Lint
npm run lint

# 运行单元测试
npm run test:node

# 压缩 SVG 图标
npm run svgo
```

## 核心架构

### 请求与认证

**`src/utils/request.js`** — 全局 Axios 实例。请求拦截器从 cookie 读取 token 注入 `Authorization` header。响应拦截器统一处理：
- `401` → 弹窗提示 + 清除 token + 跳转登录，返回 `Promise.reject`
- `5001` → 静默 reject（订单结果轮询专用）
- `50148` → 直接返回 res（优惠券边界场景）
- 其他非 200 → `showToast` + reject

**`src/utils/auth.js`** — 基于 `js-cookie` 的 token 读写，有效期 15 天。

**`src/permission.js`** — 全局路由守卫。白名单路径（首页、登录、分类、详情、搜索等）无需 token。已登录但 Vuex 无用户信息时（页面刷新场景），自动调用 `store.dispatch('user/getInfo')` 补充。

### 状态管理

Vuex 4，模块在 `src/store/modules/` 下自动加载：
- `user` — token（cookie）+ userInfo，提供 `login/logout/getInfo/resetToken` action
- `address` — 地址列表 + 当前选中地址
- `search` — 搜索历史（localStorage）

`src/store/getters.js` 暴露 `token`、`id`、`name`、`userInfo` 等顶层 getter。

### 组件注册

`src/components/` 下四个 setup 函数在 `main.js` 中统一调用：
- `Vant/index.js` — 按需注册所有用到的 Vant 组件，并在 `globalProperties` 上挂载 `$toast`、`$dialog`、`$notify` 封装
- `fontAwesome/index.js` — 仅注册 `faSort/faSortUp/faSortDown` 三个图标
- `Wx/index.js` — 挂载 `wxJsSdkInit`，调用后端 `/wx/jsSdkInit` 获取签名并初始化微信 JS SDK
- `common/` — 全局公共组件

### 工具函数

- `src/utils/index.js` — `toDecimal2`（保留两位小数）、`Valid.checkPhone`（手机号校验）、`pathMatcher`（白名单前缀匹配，`**` 通配）
- `src/filter/index.js` — `yuan`（金额格式化）、`dateFormat`（时间戳转日期），挂载到 `globalProperties`

### 打包配置

`vite.config.js` 中 `manualChunks` 将 `vue/vue-router/vuex`、`vant`、`weixin-js-sdk` 拆成独立 chunk；生产构建启用 terser 并 `drop_console`。

### SVG 图标

使用自定义 `createSvgIconsPlugin`（`build/svg-icons-plugin.js`），图标放在 `src/icons/svg/`，通过 `<svg-icon name="xxx">` 组件使用，入口通过 `virtual:svg-icons-register` 注册。

### 环境变量

使用 `VUE_APP_` 前缀（非标准 Vite 的 `VITE_` 前缀），在 `vite.config.js` 中通过 `envPrefix` 配置同时支持两者。后端接口地址通过 `VUE_APP_BASE_API` 配置，开发时通过 `/dev-api` 代理转发。
