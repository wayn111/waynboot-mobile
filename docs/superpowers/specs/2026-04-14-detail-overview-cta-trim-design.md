# Detail Overview CTA Trim Design

## Goal

精简商品详情页顶部操作区，删除中部信息卡中的“查看评价”和“立即选购”，避免与底部悬浮购买栏的主操作冲突，同时保留评论区右上角现有的“查看全部”作为唯一评价入口。

## Scope

- 删除 [src/views/detail/modules/Overview.vue](/E:/GitRepo/waynboot-mobile/src/views/detail/modules/Overview.vue) 中的顶部操作按钮区
- 保留 [src/views/detail/modules/Comment.vue](/E:/GitRepo/waynboot-mobile/src/views/detail/modules/Comment.vue) 右上角“查看全部”
- 不改变评论区真实评价列表的结构
- 不改变底部悬浮购买栏

## Out of Scope

- 不修改 [src/views/detail/modules/Tabbar.vue](/E:/GitRepo/waynboot-mobile/src/views/detail/modules/Tabbar.vue) 的购买逻辑
- 不新增评价后置按钮
- 不调整商品详情页其它信息模块顺序
- 不修改接口与数据流

## UX Decision

### Current Problem

商品详情页当前在中部信息卡里同时提供“查看评价”和“立即选购”，而底部悬浮栏又提供“加入购物车”和“立即购买”。这导致页面中部和底部出现重复且层级冲突的购买动作，分散主视线。

### Chosen Approach

采用最小裁剪方案：

- 删除顶部信息卡里的“查看评价”
- 删除顶部信息卡里的“立即选购”
- 评论入口只保留评论卡片右上角“查看全部”
- 底部悬浮栏继续作为唯一购买主操作区

### Resulting Flow

详情页主信息流调整为：

1. 商品图与价格信息
2. 配送与规格
3. 真实评价与“查看全部”
4. 商品详情
5. 底部悬浮购买栏

这样可以让页面中的 CTA 责任更清晰：中部负责信息浏览，底部负责购买。

## Architecture

### Files Affected

- Modify: [src/views/detail/modules/Overview.vue](/E:/GitRepo/waynboot-mobile/src/views/detail/modules/Overview.vue)
- Keep unchanged: [src/views/detail/modules/Comment.vue](/E:/GitRepo/waynboot-mobile/src/views/detail/modules/Comment.vue)
- Keep unchanged: [src/views/detail/modules/Tabbar.vue](/E:/GitRepo/waynboot-mobile/src/views/detail/modules/Tabbar.vue)

### Implementation Direction

在 `Overview.vue` 中移除：

- `overview__actions` 容器
- 其内部的两个按钮
- 与这些按钮相关的 `emit` 声明和样式

这样可以同步清理模板、脚本和样式三处残留，避免无用事件与无用 CSS 留在组件中。

## Failure Handling

- 本次改动不涉及接口与异步逻辑，因此无新增失败分支
- 评论区为空时仍维持现有空态文案
- 底部悬浮栏继续承接购买行为，不会因顶部裁剪导致操作缺失

## Testing Strategy

页面验收重点：

- 顶部信息卡不再出现“查看评价”
- 顶部信息卡不再出现“立即选购”
- 评论卡片右上角仍保留“查看全部”
- 底部悬浮栏的“加入购物车 / 立即购买”保持正常

## Implementation Notes

- 不需要新增组件
- 不需要新增测试文件
- 保持改动最小，只做 CTA 层级清理
