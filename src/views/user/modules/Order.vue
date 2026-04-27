<template>
  <div class="user-order">
    <div class="user-order__head">
      <h3 class="user-order__title">订单状态</h3>
      <button type="button" class="user-order__link" @click="goToOrderList(0)">
        <span>查看全部</span>
        <van-icon name="arrow" />
      </button>
    </div>

    <div class="user-order__grid">
      <button
        v-for="(item, idx) in orderList"
        :key="idx"
        type="button"
        class="user-order__item"
        @click="goToOrderList(item.type)"
      >
        <span class="user-order__item__icon">
          <van-icon :name="item.icon" size="26" color="#0071e3" />
          <span v-if="item.count" class="user-order__item__badge">{{ item.count }}</span>
        </span>
        <span class="user-order__item__name">{{ item.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'

import { statusCount } from '@/api/order'

const router = useRouter()

const state = reactive({
  orderList: [
    {
      icon: 'pending-payment',
      name: '待付款',
      count: '',
      type: 1,
    },
    {
      icon: 'peer-pay',
      name: '待发货',
      count: '',
      type: 2,
    },
    {
      icon: 'logistics',
      name: '待收货',
      count: '',
      type: 3,
    },
    {
      icon: 'chat-o',
      name: '待评价',
      count: '',
      type: 4,
    },
  ],
})
const { orderList } = toRefs(state)

const init = async () => {
  try {
    const res = await statusCount()
    orderList.value[0].count = res.data.unpaid || ''
    orderList.value[1].count = res.data.unship || ''
    orderList.value[2].count = res.data.unrecv || ''
    orderList.value[3].count = res.data.uncomment || ''
  } catch (error) {
    return error
  }
}

const goToOrderList = (type) => {
  router.push({ path: `/user/order/list/${type}` })
}

onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.user-order {
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px;
  border-radius: 34px;
  background: #ffffff;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.04);
}

.user-order__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.user-order__title {
  font-size: 34px;
  line-height: 1.1;
  font-weight: 600;
  color: #1d1d1f;
}

.user-order__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: transparent;
  color: #0066cc;
  font-size: 26px;
  line-height: 1.2;
}

.user-order__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  margin-top: 24px;
}

.user-order__item {
  position: relative;
  min-height: 118px;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  border: none;
  background: transparent;
  text-align: center;
}

.user-order__item + .user-order__item {
  border-left: 1px solid rgba(29, 29, 31, 0.04);
}

.user-order__item__icon {
  position: relative;
  width: 64px;
  height: 64px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background: rgba(0, 113, 227, 0.08);
}

.user-order__item__badge {
  position: absolute;
  top: -12px;
  right: -16px;
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #0071e3;
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  border: 4px solid #ffffff;
}

.user-order__item__name {
  font-size: 26px;
  line-height: 1.25;
  color: #1d1d1f;
}

@media (max-width: 375px) {
  .user-order {
    padding: 24px 20px;
  }

  .user-order__grid {
    gap: 10px;
  }
}
</style>
