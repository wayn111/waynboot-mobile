<template>
  <div class="product">
    <nav-bar :title="category.name">
      <van-icon
        name="shopping-cart-o"
        :color="variables.black"
        :badge="count"
        size="18"
        @click="cartClick"
      />
    </nav-bar>

    <div class="banner">
      <image-pic :src="category.picUrl" width="100%" height="100" />
    </div>

    <div class="main">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :immediate-check="false"
          @load="onLoad"
        >
          <product-item
            v-for="(item, idx) in list"
            :key="idx"
            :goods-id="item.id"
            :img="item.picUrl"
            :title="item.name"
            :desc="item.brief"
            :price="item.retailPrice"
            :discount="item.counterPrice"
            style="margin-bottom: 6px"
            @getCartGoodsCount="getCartGoodsCount"
          />
        </van-list>
      </van-pull-refresh>
    </div>

    <Skeleton v-if="isSkeletonShow" />
  </div>
</template>

<script>
import { firstCategoryGoods, secondCategoryGoods } from '@/api/product'
import { getCartGoodsCount } from '@/api/cart'
import NavBar from '@/components/NavBar'
import ProductItem from '@/components/ProductItem'
import Skeleton from './modules/Skeleton'
import variables from '@/styles/variables.scss'

export default {
  name: 'Product',
  components: {
    NavBar,
    ProductItem,
    Skeleton
  },
  props: {
    cateId: {
      type: [String, Number],
      default: 0
    },
    categoryLevel: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      list: [],
      category: [],
      initFun: '',
      count: 0,
      pageNo: 1,
      pageSize: 10,
      loading: false,
      finished: false,
      refreshing: false,
      isSkeletonShow: true
    }
  },
  computed: {
    variables() {
      return variables
    }
  },
  mounted() {
    this.initFun =
      this.categoryLevel === '1' ? firstCategoryGoods : secondCategoryGoods
    this.getProductList()
    this.getCartGoodsCount()
  },
  methods: {
    getProductList() {
      this.initFun({
        pageNum: this.pageNo,
        pageSize: this.pageSize,
        cateId: this.cateId
      }).then((res) => {
        const data = res.map.goods
        this.category = res.map.category
        if (this.refreshing) {
          this.list = data
          this.refreshing = false
        } else {
          this.list = [...this.list, ...data]
          if (data.length < this.pageSize && this.list.length > 0) {
            this.finished = true
          }
        }
        this.loading = false
        this.isSkeletonShow = false
      })
    },
    getCartGoodsCount() {
      getCartGoodsCount()
        .then((res) => {
          const { count } = res.map
          this.count = count
        })
        .catch((e) => {})
    },
    onLoad() {
      this.loading = true
      this.pageNo += 1
      this.getProductList()
    },
    onRefresh() {
      this.refreshing = true
      this.pageNo = 1
      this.getProductList()
    },
    cartClick() {
      this.$router.push({ name: 'Cart' })
    }
  }
}
</script>

<style lang="scss" scoped>
.product {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>
