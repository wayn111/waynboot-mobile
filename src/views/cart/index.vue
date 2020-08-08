<template>
  <div class="cart">
    <Nav />
    <Item
      v-for="(item,idx) in list"
      :key="idx"
      :index="item.id"
      :num="item.number"
      :thumb="item.picUrl"
      :title="item.goodsName"
      :desc="item.remark"
      :tag="'123'"
      :specifications="item.specifications"
      :tags="['满50减20', 'hot']"
      :price="item.price"
      :isChecked="item.checked"
      @input="handleItemSelect"
      @handleDelete="handleDelete"
      @changeNum="changeNum"
    />
    <Tabbar :amount="amount" :value="isAllSelect" @input="handleAllSelect" />
    <Skeleton v-if="isSkeletonShow" />
  </div>
</template>

<script>
import { getCartList, updateCart, deleteCart } from '@/api/cart'
import Nav from './modules/Nav'
import Item from './modules/Item'
import Tabbar from './modules/Tabbar'
import Skeleton from './modules/Skeleton'

export default {
  name: 'Cart',
  components: {
    Nav,
    Item,
    Tabbar,
    Skeleton
  },
  data() {
    return {
      list: [],
      amount: 0,
      isAllSelect: false,
      isSkeletonShow: true
    }
  },
  mounted() {
    this.getList()
  },
  watch: {
    list(newval) {
      let num = 0
      newval.forEach(item => {
        if (item.checked) num += parseFloat(item.price) * item.number
      })
      this.isAllSelect = newval.every(item => {
        return item.checked === true
      })
      this.amount = num * 100
    }
  },
  methods: {
    // get list
    getList() {
      getCartList().then(res => {
        const { data } = res.map
        this.list = data
        this.list.forEach(item => {
          item.price = this.$toDecimal2(item.price)
        })
        this.isSkeletonShow = false
      })
    },
    // single select
    handleItemSelect(playload) {
      const { val, idx } = playload
      const arr = this.list.filter(item => {
        return item.id === idx
      })
      const index = this.list.findIndex(item => {
        return item.id === idx
      })
      const data = { id: idx, checked: val }
      updateCart(data).then(res => {
        const newval = arr[0]
        newval.checked = val
        this.$set(this.list, index, newval)
      }).catch(e => {})
    },
    // all select
    handleAllSelect(value) {
      const data = this.list.map(item => {
        const data = { id: item.id, checked: value }
        updateCart(data).then(res => {
        }).catch(e => {})
        item.checked = value
        return item
      })
      this.list = data
    },
    // item delete
    handleDelete(idx) {
      this.$toast.loading({
        message: '加载中...',
        overlay: true,
        duration: 0,
        forbidClick: true
      })

      deleteCart(idx).then(res => {
        this.$toast.clear()
        this.$toast.success('删除成功')
        this.getList()
      }).catch(e => {})
    },
    changeNum(id, type) {
      let num = 1
      if (type === 2) {
        num = -1
      }
      let newval
      this.list.forEach(item => {
        if (item.id === id) {
          item.number += num
          newval = item
        }
      })
      const index = this.list.findIndex(item => {
        return item.id === id
      })
      this.$set(this.list, index, newval)
    }
  }
}
</script>
