<template>
  <div class="detail">
    <nav-bar title="商品详情">
      <span style="color:#333">
        <svg-icon icon-class="share" :width="15" :height="15" />
      </span>
    </nav-bar>

    <Swiper :banner="banner" />

    <Overview
      :title="info.name"
      :desc="info.brief"
      :price="info.retailPrice"
      :discount="info.counterPrice"
    />

    <Section @input="isSkuShow = $event" :stockNum="stockNum" :name="name" />

    <!-- <Comment :rate="comment.rate" :num="comment.num" :tags="comment.tags" :list="comment.list" /> -->

    <Description :description="description" />

    <Sku v-if="isSkuShow" :skuData="skuData" :goods="skuGoods" :initialSku="initialSku" @initSku="initSku($event)" @getNum="getNum" @initSkuNum="initSkuNum($event)" v-model="isSkuShow" />

    <Tabbar @input="isSkuShow = $event" ref="tabbar"/>
    <back-top />
    <Skeleton v-if="isSkeletonShow" />
  </div>
</template>

<script>
import { getDetail } from '@/api/detail'
import NavBar from '@/components/NavBar'
import Swiper from './modules/Swiper'
import Overview from './modules/Overview'
import Section from './modules/Section'
// import Comment from './modules/Comment'
import Description from './modules/Description'
import Tabbar from './modules/Tabbar'
import Sku from './modules/Sku'
import Skeleton from './modules/Skeleton'
import _ from 'lodash'

export default {
  name: 'Detail',
  props: ['goodsId'],
  components: {
    NavBar,
    Swiper,
    Overview,
    Section,
    // Comment,
    Description,
    Tabbar,
    Sku,
    Skeleton
  },
  data() {
    return {
      banner: [],
      goods: {},
      info: {},
      name: '',
      stockNum: 1,
      comment: {},
      description: '',
      skuData: {},
      initialSku: {},
      skuGoods: {},
      isSkuShow: false,
      isSkeletonShow: true
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      getDetail({
        goodsId: this.goodsId
      }).then((res) => {
        const goods = res.map
        this.goods = goods
        this.info = goods.info
        this.banner = goods.info.gallery
        this.description = goods.info.picUrl
        this.skuAdapter()
        this.isSkeletonShow = false
      })
    },
    skuAdapter() {
      const tree = this.setSkuTree()
      const list = this.setSkuList()
      const skuInfo = {
        price: parseInt(this.goods.info.retailPrice), // 未选择规格时的价格
        stock_num: 100, // TODO 总库存
        collection_id: '', // 无规格商品skuId取collection_id，否则取所选sku组合对应的id
        none_sku: false, // 是否无规格商品
        hide_stock: false
      }
      this.name = '请选择'
      this.skuData = {
        tree,
        list,
        ...skuInfo
      }
      this.skuGoods = {
        title: this.goods.info.name,
        goodsId: this.goods.info.id,
        picture: this.goods.info.picUrl,
        specificationList: this.goods.specificationList,
        productList: this.goods.productList

      }
    },
    getNum() {
      this.$refs.tabbar.getCartGoodsCount()
    },
    initSku($event) {
      const skuValue = $event.skuValue
      const selectedSku = $event.selectedSku
      if (Object.keys(selectedSku).length > 1) {
        for (const key in selectedSku) {
          this.initialSku[key] = selectedSku[key]
          if (selectedSku[key] && skuValue.skuKeyStr === key) {
            this.initialSku[key + 'name'] = skuValue.name
          } else if (skuValue.skuKeyStr === key) {
            this.initialSku[key + 'name'] = ''
          }
        }
      } else {
        for (const key in selectedSku) {
          if (selectedSku[key]) {
            this.initialSku[key + 'name'] = skuValue.name
          } else {
            this.initialSku[key + 'name'] = ''
          }
        }
      }

      const nameArr = []
      for (const key in this.initialSku) {
        if (key.indexOf('name') > 0 && this.initialSku[key]) {
          nameArr.push(this.initialSku[key])
        }
      }
      this.name = nameArr.join('，') || '请选择'
    },
    initSkuNum($event) {
      this.stockNum = $event
      this.initialSku.selectedNum = $event
    },
    setSkuTree() {
      const specifications = []
      _.each(this.goods.specificationList, (v, k) => {
        const values = []
        _.each(v.valueList, (vv) => {
          vv.name = vv.value
          values.push({
            id: vv.id,
            name: vv.value,
            imUrl: vv.picUrl
          })
        })
        specifications.push({
          k: v.name,
          v: values,
          k_s: 's' + (~~k + 1)
        })
      })

      return specifications
    },
    setSkuList() {
      const skuList = []
      _.each(this.goods.productList, (v) => {
        var skuListObj = {}
        _.each(v.specifications, (specificationName, index) => {
          skuListObj['s' + (~~index + 1)] = this.findSpecValueIdByName(
            specificationName
          )
        })

        skuListObj.price = v.price * 100
        skuListObj.stock_num = v.number
        skuList.push(skuListObj)
      })
      return skuList
    },
    findSpecValueIdByName(name) {
      let id = 0
      _.each(this.goods.specificationList, (specification) => {
        _.each(specification.valueList, (specValue) => {
          if (specValue.value === name) {
            id = specValue.id
          }
        })
        if (id !== 0) {
        }
      })
      return id
    }
  }
}
</script>

<style lang="scss" scoped>
.detail {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>
