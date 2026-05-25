# waynboot-mobile

`waynboot-mobile` 是 `waynboot-mall` 的移动端 H5 商城前台，负责首页、分类、搜索、商品详情、购物车、下单、支付、订单、地址、优惠券和用户中心等核心购物链路。

项目已经迁移到 Vue 3 + Vite 6 + Vant 4。当前代码重点是移动端体验、浅色 Apple 风格 UI、清晰商品信息和稳定下单流程。

## 技术栈

| 分类 | 方案 |
| --- | --- |
| 应用框架 | Vue 3、Composition API、`<script setup>` |
| 构建工具 | Vite 6、`@vitejs/plugin-vue` |
| UI 组件 | Vant 4 |
| 路由 | Vue Router 4，Hash 路由，部署基础路径 `/mall/` |
| 状态管理 | Vuex 4，模块自动注册 |
| 请求 | Axios，统一 Token 注入和业务错误处理 |
| 样式 | Sass、`postcss-pxtorem`、项目设计系统 |
| 图标 | 本地 SVG 图标插件、FontAwesome、iconfont |
| 微信能力 | `weixin-js-sdk` |

## 快速开始

### 环境要求

- Node.js >= 18
- npm

### 安装依赖

```bash
npm install
```

### 启动开发服务

```bash
npm run dev
```

默认访问地址：

```text
http://localhost:4949/mall/#/
```

开发环境接口配置来自 `.env.development`：

```text
VUE_APP_BASE_PATH=/mall
VUE_APP_BASE_API=/dev-api
VUE_APP_BASE_URL=http://localhost:82
```

Vite 代理会将 `/dev-api` 和 `/upload` 转发到 `VUE_APP_BASE_URL`。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动本地开发服务 |
| `npm run lint` | 检查 `src/` 下的 `.js` 和 `.vue` 文件 |
| `npm run test:node` | 运行 Node 回归测试 |
| `npm run build:prod` | 生产模式构建，压缩并移除 `console` / `debugger` |
| `npm run build:dev` | 开发模式构建，便于排查构建问题 |
| `npm run svgo` | 压缩 `src/icons/svg/` 图标 |

## 目录结构

```text
.
├── build/                  # Vite 自定义插件
├── public/                 # 公共静态资源
├── src/
│   ├── api/                # 业务接口封装
│   ├── assets/             # 本地图片、iconfont 等资源
│   ├── components/         # 全局可复用组件和插件注册
│   ├── filter/             # 全局格式化方法
│   ├── icons/svg/          # SVG 图标源文件
│   ├── router/             # 路由配置
│   ├── store/              # Vuex 入口与业务模块
│   ├── styles/             # 全局样式、设计系统、Vant 覆盖
│   ├── utils/              # 请求、鉴权、适配和通用工具
│   ├── views/              # 页面级视图
│   ├── App.vue             # 应用根组件
│   ├── main.js             # 应用入口
│   └── permission.js       # 路由权限守卫
├── vite.config.js          # Vite 配置
├── postcss.config.js       # PostCSS / pxtorem 配置
├── package.json            # 脚本和依赖
└── README.md
```

## 核心模块

### 应用入口

`src/main.js` 负责创建应用并注册核心能力：

- `router`：页面路由。
- `store`：Vuex 状态管理。
- `setupVant(app)`：Vant 组件和兼容 API。
- `setupWx(app)`：微信 SDK。
- `setupFontAwesome(app)`：FontAwesome 图标。
- `setupCommonComponents(app)`：`image-pic`、`nav-bar`、`svg-icon`、`back-top` 等公共组件。
- `setupFilters(app)`：全局格式化方法。

### 路由与权限

路由位于 `src/router/index.js`，统一使用 `createWebHashHistory()` 和页面懒加载。

`src/permission.js` 负责：

- 根据 `meta.title` 设置页面标题。
- 基于 Cookie Token 判断登录态。
- 对购物车、订单、地址、用户中心等页面做登录拦截。
- 未登录时跳转 `/login?redirect=...`。
- 路由结束后关闭 Vant Toast。

### 接口层

`src/api/` 按业务域拆分：

- `home.js`：首页数据。
- `category.js`：分类。
- `search.js`：搜索。
- `product.js` / `diamond.js` / `detail.js`：商品列表、专题和详情。
- `cart.js`：购物车。
- `order.js` / `pay.js` / `coupon.js`：订单、支付和优惠券。
- `login.js` / `user.js` / `address.js`：登录、用户和地址。

统一请求实例在 `src/utils/request.js`：

- 使用 `import.meta.env.VUE_APP_BASE_API` 作为 `baseURL`。
- 请求时自动携带 `Authorization`。
- 统一处理业务 `code`、登录失效和错误提示。
- 提供 `formDataPost()` 兼容表单提交接口。

### 状态管理

`src/store/index.js` 通过 `import.meta.glob('./modules/*.js', { eager: true })` 自动注册模块。当前主要模块：

- `user`：Token、用户信息、登录和退出。
- `address`：地址列表、默认地址和当前选择。
- `search`：搜索历史与搜索状态。

### 移动端适配

- `src/utils/flexible` 设置根字号。
- `postcss-pxtorem` 将 `px` 转为 `rem`。
- 项目样式 `rootValue` 为 `75`，Vant 样式 `rootValue` 为 `37.5`。
- `.ignore` 选择器会跳过转换。

## 页面入口

| 路由 | 页面 |
| --- | --- |
| `/` | 首页 |
| `/category` | 分类 |
| `/search` | 搜索 |
| `/search/list` | 搜索结果 |
| `/product/:categoryLevel/:cateId` | 分类商品列表 |
| `/diamondGoodsList/:diamondId` | 金刚位专题商品列表 |
| `/detail/:goodsId` | 商品详情 |
| `/cart` | 购物车 |
| `/order/confirm` | 确认订单 |
| `/order/pay` | 订单支付 |
| `/order/payStatus` | 支付结果 |
| `/user/order/list/:active` | 订单列表 |
| `/order/detail/:orderSn` | 订单详情 |
| `/order/coupon` | 领券中心 |
| `/order/my` | 我的优惠券 |
| `/address` | 地址管理 |
| `/user` | 我的 |
| `/userSetting` | 用户设置 |
| `/login` | 登录 |
| `/registry` | 注册 |

## UI 与设计约束

商城前台 UI 以 `DESIGN.md` 和 `AGENTS.md` 为准，落地为浅色 Apple 风格 H5：

- 页面背景以 `#f5f5f7`、白色和浅灰为主。
- 主文字使用 `#1d1d1f`，主交互使用 `#0071e3`。
- 正文和按钮文字保持移动端可读，不使用过小字号。
- 卡片遵循单层容器原则，避免玻璃嵌套和厚重阴影。
- 首页、分类、搜索、购物车、订单、我的等前台页面禁止大面积黑底。
- 不引入与商城功能无关的品牌口号、装饰性长文案和占位描述。
- UI 改动后必须使用移动端 viewport、移动端 UA 和 touch 环境自检。

## 开发约定

- 新页面使用 Vue 3 `<script setup>`。
- 页面放在 `src/views/<module>/`，仅当前页面使用的子组件放在页面 `modules/` 目录。
- 可跨页面复用的组件放在 `src/components/`。
- 业务接口按领域放在 `src/api/`。
- Vant Toast、Dialog、Notify 优先使用函数式 API。
- 路由组件直接使用 `() => import(...)` 懒加载。
- 删除文件前必须先通过路由、导入和全局注册确认没有引用。

## 提交前检查

建议至少执行：

```bash
npm run lint
npm run test:node
npm run build:prod
```

涉及 UI 的改动，除自动化检查外，还需要检查：

- 移动端首屏是否正常渲染。
- 页面是否出现横向滚动。
- 固定底栏、Tabbar、结算栏是否遮挡内容。
- 搜索、筛选、加购、下单、支付、跳转等核心操作是否可点击。
- 控制台是否出现新增 error / warn。

## 相关项目

- H5 商城：<https://github.com/wayn111/waynboot-mobile>
- 运营后台：<https://github.com/wayn111/waynboot-admin>
- 后台接口：<https://github.com/wayn111/waynboot-mall>
