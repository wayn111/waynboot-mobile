<template>
  <div class="cart">
    <Nav />

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

    <Tabbar
      v-if="list.length > 0"
      :amount="amount"
      :selected-ids="selectedCartIds"
      :model-value="isAllSelect"
      @update:model-value="handleAllSelect"
    />

    <Skeleton v-if="isSkeletonShow" />
    <van-empty
      v-if="!isSkeletonShow && list.length <= 0"
      description="购物车还是空的，去挑选喜欢的商品吧"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, toRefs } from 'vue'
import { closeToast, showLoadingToast, showToast } from 'vant'

import { deleteCart, getCartList, updateCart } from '@/api/cart'
import { yuan } from '@/filter'
import Item from './modules/Item'
import Nav from './modules/Nav'
import Skeleton from './modules/Skeleton'
import Tabbar from './modules/Tabbar'

const state = reactive({
  list: [],
  isSkeletonShow: true,
})

const { list, isSkeletonShow } = toRefs(state)

const isItemSelectable = (item) => {
  return Number(item?.maxNum) >= Number(item?.number)
}

const amount = computed(() => {
  return list.value
    .filter((item) => isItemSelectable(item) && item.checked)
    .reduce((total, item) => {
      return total + Number(item.price || 0) * Number(item.number || 0)
    }, 0)
})

const selectedCartIds = computed(() => {
  return list.value
    .filter((item) => isItemSelectable(item) && item.checked)
    .map((item) => item.id)
})

const isAllSelect = computed(() => {
  const selectableList = list.value.filter((item) => isItemSelectable(item))
  if (selectableList.length <= 0) {
    return false
  }
  return selectableList.every((item) => item.checked)
})

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

onMounted(() => {
  getList()
})
</script>
