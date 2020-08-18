<template>
  <div class="product">
    <nav-bar title="商品列表">
      <van-icon name="shopping-cart-o" :color="variables.black" size="18" />
    </nav-bar>

    <div class="banner">
      <image-pic
        src="http://m.360buyimg.com/babel/jfs/t1/106316/25/14939/138006/5e6a3b4dE5609efcf/27de6ed334aa7c9b.jpg!q70.dpg"
        width="100%"
        height="100"
      />
    </div>

    <div class="main">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
        >
          <product-item
            v-for="(item,idx) in list"
            :key="idx"
            :goodsId="item.id"
            :img="item.picUrl"
            :title="item.name"
            :desc="item.brief"
            :price="item.retailPrice"
            :discount="item.counterPrice"
            :percentage="30"
            style="margin-bottom:6px"
          />
        </van-list>
      </van-pull-refresh>
    </div>

    <Skeleton v-if="isSkeletonShow"/>
  </div>
</template>

<script>
import { getList } from '@/api/product'
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
    }
  },
  data() {
    return {
      list: [],
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
    this.getProductList()
  },
  methods: {
    getProductList() {
      getList({
        pageNum: this.pageNo,
        pageSize: this.pageSize,
        cateId: this.cateId
      }).then(res => {
        const data = res.map.data
        if (this.refreshing) {
          this.list = [{
            img: 'http://img3m1.ddimg.cn/31/4/20039611-1_b_9.jpg',
            title: '小熊和最好的爸爸（全7册）',
            desc:
            '作者：（荷）阿兰德·丹姆  著，（荷）亚历克斯·沃尔夫  绘，漆仰平，爱桐  译 ',
            price: 1233,
            discount: 322,
            percentage: 70
          },
          {
            img: 'http://img3m2.ddimg.cn/0/27/28473192-1_b_3.jpg',
            title:
            '你当像鸟飞往你的山（比尔·盖茨年度特别推荐，登顶《纽约时报》畅销榜80 周！多一个人读到这个真实故事，就多一个人勇敢做自己！',
            desc: '作者：塔拉·韦斯特弗著，新经典出品',
            price: 1000,
            discount: 888,
            percentage: 40
          },
          {
            img: 'http://img3m0.ddimg.cn/61/3/23444350-1_b_4.jpg',
            title: '神奇校车·桥梁书版（全20',
            desc: '作者：乔安娜柯尔　著 布鲁斯迪根 图　施芳',
            price: 8833,
            discount: 987,
            percentage: 60
          }]
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
    onLoad() {
      this.loading = true
      this.pageNo += 1
      this.getProductList()
    },
    onRefresh() {
      this.refreshing = true
      this.pageNo = 1
      this.getProductList()
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
