# Home New Arrival Rail Design

## Goal

将首页“新品上线”区块从两列商品栅格改为横向滑动的大卡陈列带，突出“新品”标签与价格信息，同时保持首页现有的轻奢浅色视觉语言与商品详情跳转逻辑。

## Scope

- 仅改首页“新品上线”区块
- 将内容区改为左右滑动的大卡滑轨
- 每张卡片突出新品标签、现价和原价
- 点击卡片仍跳转商品详情页

## Out of Scope

- 不改“热卖商品”区块
- 不改首页推荐流与其它模块
- 不改任何接口协议或数据结构
- 不新增复杂轮播控制器或新的滚动库依赖

## UX Decision

### Placement

保留 [src/views/home/index.vue](/E:/GitRepo/waynboot-mobile/src/views/home/index.vue) 中“新品上线”当前所在位置，只替换该区块的内容组件，不调整首页整体顺序。

### Interaction

- 使用横向滑动浏览新品
- 每张卡片占据大约 78% 到 84% 屏宽
- 右侧露出下一张卡的一角，强化“可继续滑动”的暗示
- 点击整卡进入 `/detail/:id`

### Information Hierarchy

卡片的首要层级为：

1. `NEW ARRIVAL` 标签
2. 当前价与原价
3. 商品主图
4. 商品标题与一句简短描述

卡片不增加“立即购买”等额外交互，避免横滑区域变成复杂运营位。

## Visual Direction

视觉延续仓库当前首页与 `DESIGN.md` 的 Apple-inspired 方向：

- 继续使用浅灰页面底色 `#f5f5f7`
- 卡片使用大圆角、浅色表面与轻层次阴影
- 强调色仅使用蓝色 `#0071e3`
- 不采用传统促销红橙色视觉
- 商品图放在干净背景上，强调产品陈列感

卡片结构建议为：

- 顶部：新品标签、现价、原价
- 中部：大面积商品图
- 底部：商品名与简短描述

## Architecture

### Dedicated Component

新增 [src/views/home/modules/NewArrivalRail.vue](/E:/GitRepo/waynboot-mobile/src/views/home/modules/NewArrivalRail.vue) 作为“新品上线”专用组件，而不是继续扩展 [src/views/home/modules/GoodsLimit.vue](/E:/GitRepo/waynboot-mobile/src/views/home/modules/GoodsLimit.vue)。这样可以避免“新品上线”和“热卖商品”共享过重组件。

### Homepage Integration

在 [src/views/home/index.vue](/E:/GitRepo/waynboot-mobile/src/views/home/index.vue) 中，仅将“新品上线”的 `Goods-limit` 替换为 `NewArrivalRail`；`热卖商品` 继续保留原有 `GoodsLimit` 实现。

### Tiny Mapping Helper

新增一个小型纯函数文件 [src/views/home/modules/newArrivalRail.mjs](/E:/GitRepo/waynboot-mobile/src/views/home/modules/newArrivalRail.mjs)，只负责卡片价格显示文案的整理，避免把价格格式逻辑散在模板里。

## Behavior Rules

- 组件直接消费现有 `newGoodsList`
- 如果 `newGoodsList` 为空，则整个区块不渲染
- 如果商品存在 `counterPrice`，展示划线原价
- 如果 `counterPrice` 为空或等于 0，仅展示现价
- 商品名最多展示两行
- 商品描述最多展示一行

## Failure Handling

- 该改造不引入新接口，因此不新增额外失败分支
- 数据为空时不展示滑轨区块，避免首页出现空白运营位

## Testing Strategy

新增一个小型纯函数测试，覆盖：

- 有原价时的价格文案映射
- 无原价时的价格文案映射
- 空值兼容

页面验收只验证：

- “新品上线”变为横向滑动大卡
- 右侧可看到下一张卡的一角
- 卡片优先展示新品标签和价格
- 点击卡片能进入商品详情
- “热卖商品”保持现有两列布局不变

## Implementation Notes

- 优先使用原生横向滚动与 `scroll-snap`
- 不引入新的第三方滚动依赖
- 保持与首页其他模块一致的左右边距
- 新组件职责单一：渲染与点击跳转；价格格式由纯函数辅助文件提供
