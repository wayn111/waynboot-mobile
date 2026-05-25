<template>
  <div class="cart wb-page wb-page--tabbed">
    <Nav />
    <Skeleton v-if="isSkeletonShow" />
    <template v-else>
      <div v-if="list.length > 0" class="cart__body">
        <section class="cart__hero">
          <div class="cart__hero__head">
            <div class="cart__hero__main">
              <span class="cart__hero__eyebrow">待结算金额</span>
              <h1 class="cart__hero__amount">¥{{ yuan(amount) }}</h1>
              <p class="cart__hero__meta">已选 {{ selectedCount }} 件商品，可直接进入结算</p>
            </div>
            <span class="cart__hero__badge">{{ selectedCartIds.length }} 款已选</span>
          </div>

          <div class="cart__hero__stats">
            <div class="cart__hero__stat">
              <span class="cart__hero__stat-label">商品件数</span>
              <strong class="cart__hero__stat-value">{{ totalCount }}</strong>
            </div>
            <div class="cart__hero__stat">
              <span class="cart__hero__stat-label">可结算</span>
              <strong class="cart__hero__stat-value">{{ validItemCount }}</strong>
            </div>
            <div class="cart__hero__stat">
              <span class="cart__hero__stat-label">失效商品</span>
              <strong class="cart__hero__stat-value">{{ invalidItemCount }}</strong>
            </div>
          </div>
        </section>

        <section class="cart__section">
          <div class="cart__section__head">
            <h2 class="cart__section__title">购物清单</h2>
            <span class="cart__section__meta">{{ list.length }} 款商品</span>
          </div>

          <div class="cart__list">
            <Item
              v-for="item in list"
              :key="item.id"
              v-model="item.checked"
              :index="item.id"
              :num="item.number"
              :max-num="item.maxNum"
              :thumb="item.picUrl"
              :title="item.goodsName"
              :desc="(item.specifications || []).join(' ')"
              :tag="item.tag"
              :tags="['满50减10', 'hot']"
              :price="yuan(item.price)"
              @changeChecked="handleItemSelect"
              @handleDelete="handleDelete"
              @changeNum="changeNum"
            />
          </div>
        </section>
      </div>

      <Tabbar
        v-if="list.length > 0"
        :amount="amount"
        :selected-ids="selectedCartIds"
        :model-value="isAllSelect"
        @update:model-value="handleAllSelect"
      />

      <div v-if="list.length <= 0" class="cart-empty">
        <section class="cart-empty__panel">
          <div class="cart-empty__symbol">
            <van-icon name="shopping-cart-o" />
          </div>
          <span class="cart-empty__eyebrow">购物车</span>
          <h1 class="cart-empty__title">还没有加入任何商品</h1>
          <p class="cart-empty__desc">从分类或首页挑选商品后，这里会自动整理成待结算清单。</p>
          <div class="cart-empty__actions">
            <button
              type="button"
              class="cart-empty__action cart-empty__action--primary"
              @click="goCategory"
            >
              去逛分类
            </button>
            <button type="button" class="cart-empty__action" @click="goHome">
              回到首页
            </button>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { closeToast, showLoadingToast, showToast } from 'vant'

import { deleteCart, getCartList, updateCart } from '@/api/cart'
import { yuan } from '@/filter'
import Item from './modules/Item'
import Nav from './modules/Nav'
import Skeleton from './modules/Skeleton'
import Tabbar from './modules/Tabbar'

const router = useRouter()

const state = reactive({
  list: [],
  isSkeletonShow: true,
})

const { list, isSkeletonShow } = toRefs(state)

const isItemSelectable = (item) => {
  return Number(item?.maxNum) >= Number(item?.number)
}

const selectableList = computed(() => list.value.filter(isItemSelectable))

const amount = computed(() => {
  return selectableList.value
    .filter((item) => item.checked)
    .reduce((total, item) => total + Number(item.price || 0) * Number(item.number || 0), 0)
})

const selectedCartIds = computed(() =>
  selectableList.value.filter((item) => item.checked).map((item) => item.id)
)

const isAllSelect = computed(() => {
  if (selectableList.value.length <= 0) return false
  return selectableList.value.every((item) => item.checked)
})

const totalCount = computed(() =>
  list.value.reduce((total, item) => total + Number(item.number || 0), 0)
)

const selectedCount = computed(() =>
  selectableList.value
    .filter((item) => item.checked)
    .reduce((total, item) => total + Number(item.number || 0), 0)
)

const validItemCount = computed(() => selectableList.value.length)

const invalidItemCount = computed(() => list.value.length - selectableList.value.length)

const getList = async () => {
  try {
    const res = await getCartList()
    list.value = res.data || []
  } finally {
    isSkeletonShow.value = false
  }
}

const handleItemSelect = async ({ val, idx }) => {
  const index = list.value.findIndex((item) => item.id === idx)
  if (index < 0) {
    return
  }

  const prevChecked = list.value[index].checked

  try {
    await updateCart({ id: idx, checked: val })
    list.value[index].checked = val
  } catch (error) {
    list.value[index].checked = prevChecked
    showToast({
      type: 'fail',
      message: error?.message || '勾选状态更新失败',
    })
  }
}

const handleAllSelect = async (value) => {
  const changedItems = list.value.filter((item) => {
    return isItemSelectable(item) && item.checked !== value
  })

  if (changedItems.length <= 0) {
    return
  }

  const previousState = changedItems.map((item) => ({
    id: item.id,
    checked: item.checked,
  }))

  changedItems.forEach((item) => {
    item.checked = value
  })

  try {
    await Promise.all(
      changedItems.map((item) => {
        return updateCart({ id: item.id, checked: value })
      })
    )
  } catch (error) {
    previousState.forEach((item) => {
      const target = list.value.find((cartItem) => cartItem.id === item.id)
      if (target) {
        target.checked = item.checked
      }
    })
    showToast({
      type: 'fail',
      message: error?.message || '全选状态更新失败',
    })
  }
}

const handleDelete = async (idx) => {
  showLoadingToast({
    type: 'loading',
    message: '删除中...',
    overlay: true,
    duration: 0,
    forbidClick: true,
  })

  try {
    await deleteCart(idx)
    const index = list.value.findIndex((item) => item.id === idx)
    if (index >= 0) {
      list.value.splice(index, 1)
    }
    closeToast()
    showToast({
      type: 'success',
      message: '删除成功',
    })
  } catch (error) {
    closeToast()
    showToast({
      type: 'fail',
      message: error?.message || '删除失败',
    })
  }
}

const changeNum = (id, num) => {
  const index = list.value.findIndex((item) => item.id === id)
  if (index < 0) {
    return
  }

  list.value[index].number = num
}

const goHome = () => {
  router.push('/')
}

const goCategory = () => {
  router.push('/category')
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.cart {
  min-height: 100%;
  background: linear-gradient(180deg, #f6f7fb 0%, #f3f5f9 100%);
}

.cart__body {
  width: 100%;
  max-width: var(--wb-content-width);
  margin: 0 auto;
  padding: 20px 24px 24px;
}

.cart__hero {
  padding: 28px 24px 24px;
  border-radius: 36px;
  background: #ffffff;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
}

.cart__hero__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.cart__hero__main {
  min-width: 0;
  flex: 1;
}

.cart__hero__eyebrow {
  display: block;
  font-size: 26px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.46);
}

.cart__hero__amount {
  margin-top: 14px;
  font-size: 64px;
  line-height: 1;
  letter-spacing: -0.32px;
  font-weight: 600;
  color: #1d1d1f;
}

.cart__hero__meta {
  margin-top: 14px;
  font-size: 28px;
  line-height: 1.45;
  color: rgba(29, 29, 31, 0.58);
}

.cart__hero__badge {
  min-height: 40px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-size: 26px;
  line-height: 1;
  font-weight: 600;
  color: #0071e3;
  background: rgba(0, 113, 227, 0.08);
}

.cart__hero__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 22px;
}

.cart__hero__stat {
  padding: 18px 16px;
  border-radius: 24px;
  background: #f5f5f7;
}

.cart__hero__stat-label {
  display: block;
  font-size: 26px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.46);
}

.cart__hero__stat-value {
  display: block;
  margin-top: 12px;
  font-size: 38px;
  line-height: 1;
  font-weight: 600;
  color: #1d1d1f;
}

.cart__section {
  margin-top: 22px;
}

.cart__section__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.cart__section__title {
  font-size: 42px;
  line-height: 1.08;
  font-weight: 600;
  color: #1d1d1f;
}

.cart__section__meta {
  font-size: 28px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.46);
}

.cart__list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

:deep(.van-empty) {
  padding-top: 180px;
}

.cart-empty {
  width: 100%;
  max-width: var(--wb-content-width);
  margin: 0 auto;
  padding: 60px 20px 32px;
}

.cart-empty__panel {
  padding: 56px 32px 48px;
  border-radius: 36px;
  background: #ffffff;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
  text-align: center;
}

.cart-empty__symbol {
  width: 180px;
  height: 180px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(180deg, #eaf2ff 0%, #f4f8ff 100%);
  color: #0071e3;
  font-size: 96px;
}

.cart-empty__symbol :deep(.van-icon) {
  font-size: 96px;
}

.cart-empty__eyebrow {
  display: block;
  margin-top: 28px;
  font-size: 26px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.42);
}

.cart-empty__title {
  margin-top: 14px;
  font-size: 42px;
  line-height: 1.2;
  font-weight: 700;
  color: #1d1d1f;
  letter-spacing: -0.2px;
}

.cart-empty__desc {
  margin: 18px auto 0;
  max-width: 560px;
  font-size: 26px;
  line-height: 1.55;
  color: rgba(29, 29, 31, 0.5);
}

.cart-empty__actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;
}

.cart-empty__action {
  min-width: 180px;
  height: 88px;
  padding: 0 32px;
  border-radius: 999px;
  border: 1px solid rgba(0, 113, 227, 0.22);
  background: #ffffff;
  color: #0071e3;
  font-size: 30px;
  line-height: 1;
  font-weight: 600;
  cursor: pointer;
}

.cart-empty__action--primary {
  border-color: #0071e3;
  background: #0071e3;
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(0, 113, 227, 0.28);
}

@media (max-width: 375px) {
  .cart__body {
    padding: 16px 20px 24px;
  }

  .cart__hero {
    padding: 24px 20px 20px;
  }

  .cart__hero__head,
  .cart__section__head {
    flex-direction: column;
    align-items: flex-start;
  }

  .cart__hero__amount {
    font-size: 56px;
  }

  .cart__hero__stats {
    grid-template-columns: 1fr;
  }

  .cart-empty {
    padding: 44px 14px 24px;
  }

  .cart-empty__panel {
    padding: 34px 18px 28px;
  }

  .cart-empty__actions {
    flex-direction: column;
  }

  .cart-empty__action {
    width: 100%;
  }
}
</style>
