# Home Coupon Entry Design

## Goal

在首页商品流中新增一个优惠券入口模块，调用 `/coupon/list` 获取代表性优惠券数据，并按当前仓库的 Apple-inspired 视觉语言展示为一张主运营卡。模块本身不执行领取，只承担首页曝光与导流职责，点击后统一跳转到 `/order/coupon`。

## Scope

- 新增首页优惠券入口卡片
- 调用 `/coupon/list` 获取首页展示数据
- 在首页中段插入该模块，位置固定在“新品上线”和“热卖商品”之间
- 点击整张卡片跳转 `/order/coupon`
- 无数据或请求失败时保留通用入口卡，不隐藏模块

## Out of Scope

- 首页直接领取优惠券
- 修改 `/order/coupon` 页的领取流程
- 改动优惠券接口协议
- 增加新的全局状态管理

## Data Source

首页模块复用现有订单域接口：

- `GET /coupon/list`
- 请求参数：`pageNum=1`、`pageSize=2`

接口返回 `ShopCouponResVO` 列表，首页只消费以下字段：

- `id`
- `title`
- `discount`
- `min`
- `receiveStatus`
- `type`
- `expireTime`

## UX Decision

### Placement

模块插入 [src/views/home/index.vue](/E:/GitRepo/waynboot-mobile/src/views/home/index.vue) 的两个 `GoodsLimit` 区块之间，也就是“新品上线”后、“热卖商品”前。这样既处在商品流中段，又不会挤占首页首屏。

### Interaction

- 整张卡片可点击
- 点击跳转 `/order/coupon`
- 不提供首页内领取按钮
- 右上角提供轻量的“查看全部”提示，但不形成第二主按钮

### Content Strategy

当接口返回有效券数据时，模块展示：

- 标题：`领券中心`
- 副文案：强调“下单前先看看可用优惠”
- 右侧露出 1-2 张代表性券面

当接口无数据或请求失败时，模块展示：

- 标题仍为 `领券中心`
- 副文案改为通用权益入口说明
- 不展示具体面额信息

## Visual Direction

视觉语言继续沿用仓库当前首页方向与 `DESIGN.md`：

- 页面底色保持浅灰 `#f5f5f7`
- 模块主体使用白色或半透明白卡片
- 强调色只使用蓝色 `#0071e3`
- 不采用传统红黄促销券样式
- 券面预览采用轻错层、低对比阴影、圆角卡片表达

卡片结构建议为：

- 左侧：标题、副文案、轻量 `查看全部`
- 右侧：1-2 张错层券面预览

整体应明显是“权益入口”，而不是首页主促销横幅。

## Architecture

### Home Page Composition

在 [src/views/home/index.vue](/E:/GitRepo/waynboot-mobile/src/views/home/index.vue) 中新增首页优惠券状态，并在 `onMounted` 时独立请求优惠券列表。该请求不与首页其他接口共享 loading，也不影响其他模块渲染。

### New UI Module

新增 [src/views/home/modules/CouponEntry.vue](/E:/GitRepo/waynboot-mobile/src/views/home/modules/CouponEntry.vue) 承担纯视觉渲染与点击跳转，避免首页主文件继续膨胀。

### Mapping Helper

新增 [src/views/home/modules/homeCoupon.mjs](/E:/GitRepo/waynboot-mobile/src/views/home/modules/homeCoupon.mjs) 处理首页展示数据的纯函数映射。该文件负责：

- 对接口记录排序
- 截取最多 2 张券
- 生成展示标签和文案
- 产出组件可直接消费的轻量视图模型

## Coupon Selection Rules

首页展示券按照以下顺序选取：

1. `receiveStatus = 0` 的未领取券优先
2. 在同一领取状态下，`discount` 较高的优先
3. 最多展示 2 张

字段文案映射规则：

- `type = 1` 显示为 `注册礼`
- `type = 2` 显示为 `通用券`
- `discount` 显示为主金额
- `min` 显示为 `满 X 可用`
- `expireTime` 转换为简短有效期文案；如果为空则不展示

## Failure Handling

- `/coupon/list` 请求失败时，不弹 toast
- 请求失败时回退为通用入口卡
- 返回空列表时同样显示通用入口卡
- 首页其他模块不依赖此接口结果

## Testing Strategy

新增一个小型纯函数测试，覆盖：

- 未领取券优先
- 同领取状态下按优惠金额降序
- 最多保留 2 张
- `type`、门槛、有效期文案映射
- 空数据回退为通用入口模型

页面验收只验证：

- 首页在中段出现优惠券入口卡
- 有券时显示 1-2 张券预览
- 无券时显示通用入口内容
- 点击卡片后跳转 `/order/coupon`

## Implementation Notes

- 优先复用 [src/api/order.js](/E:/GitRepo/waynboot-mobile/src/api/order.js) 中已有的 `orderCoupon`
- 不新增 Vuex 状态
- 不改动 `/order/coupon` 页现有领取逻辑
- 保持组件职责单一：页面负责拉数，模块负责渲染，纯函数负责映射
