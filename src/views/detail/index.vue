<template>
  <div class="detail">
    <nav-bar :title="info.name">
      <!-- 预留分享入口 -->
    </nav-bar>

    <Swiper :banner="banner" />

    <Overview
      :title="info.name"
      :desc="info.brief"
      :price="info.retailPrice"
      :discount="info.counterPrice"
      :virtual-sales="info.virtualSales"
    />

    <Section
      :stock-num="stockNum"
      :name="name"
      :attr="attributes"
      :freight-limit="mallConfig.freightLimit"
      @update:value="isSkuShow = $event"
    />

    <Comment
      :rate="comment.rate"
      :num="comment.num"
      :tags="comment.tags"
      :list="comment.list"
      :goods-id="goodsId"
    />

    <Description :description="description" />

    <Sku
      v-if="isSkuShow"
      v-model="isSkuShow"
      :sku-data="skuData"
      :goods="skuGoods"
      :initial-sku="initialSku"
      @initSku="initSku($event)"
      @getNum="getNum"
      @initSkuNum="initSkuNum($event)"
    />

    <Tabbar ref="tabbar" @update:value="isSkuShow = $event" />
    <back-top />
    <Skeleton v-if="isSkeletonShow" />
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue'
import _ from 'lodash'
import wx from 'weixin-js-sdk'

import { getCommentList, getCommentTagNum } from '@/api/comment'
import { getDetail } from '@/api/detail'
import { getMallConfig } from '@/api/home'
import Comment from './modules/Comment'
import Description from './modules/Description'
import Overview from './modules/Overview'
import Section from './modules/Section'
import Skeleton from './modules/Skeleton'
import Sku from './modules/Sku'
import Swiper from './modules/Swiper'
import Tabbar from './modules/Tabbar'

const { proxy } = getCurrentInstance()

const props = defineProps({
  goodsId: {
    type: String,
    default: '',
  },
})

const state = reactive({
  banner: [],
  goods: {},
  info: {},
  mallConfig: {},
  name: '',
  stockNum: 1,
  totalStockNum: 0,
  attributes: [],
  comment: {
    rate: 0,
    num: '0',
    tags: [],
    list: [],
  },
  description: '',
  skuData: {},
  initialSku: {},
  skuGoods: {},
  isSkuShow: false,
  isSkeletonShow: true,
})

const {
  banner,
  goods,
  info,
  mallConfig,
  name,
  stockNum,
  totalStockNum,
  attributes,
  comment,
  description,
  skuData,
  initialSku,
  skuGoods,
  isSkuShow,
  isSkeletonShow,
} = toRefs(state)

const tabbar = ref(null)

const wxShare = async (goodsInfo) => {
  if (typeof proxy?.wxJsSdkInit === 'undefined') {
    return
  }

  const inited = await proxy.wxJsSdkInit()
  if (!inited) {
    return
  }

  const url = window.location.href.split('#')[0]
  const picUrl = `${url}${goodsInfo.picUrl}`

  wx.ready(() => {
    wx.updateAppMessageShareData({
      title: goodsInfo.name,
      desc: goodsInfo.brief,
      link: window.location.href,
      imgUrl: picUrl,
    })

    wx.updateTimelineShareData({
      title: goodsInfo.name,
      link: window.location.href,
      imgUrl: picUrl,
    })
  })
}

const handleGetMallConfig = () => {
  getMallConfig().then((res) => {
    mallConfig.value = res.data
  })
}

const findSpecValueIdByName = (specValueName) => {
  let id = 0
  _.each(goods.value.specificationList, (specification) => {
    _.each(specification.valueList, (specValue) => {
      if (specValue.value === specValueName) {
        id = specValue.id
      }
    })
  })
  return id
}

const setSkuTree = () => {
  const specifications = []

  _.each(goods.value.specificationList, (item, index) => {
    const values = []
    _.each(item.valueList, (valueItem) => {
      values.push({
        id: valueItem.id,
        name: valueItem.value,
        imgUrl: valueItem.picUrl,
        previewImgUrl: valueItem.picUrl,
      })
    })

    specifications.push({
      k: item.name,
      v: values,
      k_s: `s${index + 1}`,
    })
  })

  return specifications
}

const setSkuList = () => {
  const list = []

  _.each(goods.value.productList, (item) => {
    const skuItem = {}

    _.each(item.specifications, (specificationName, index) => {
      skuItem[`s${index + 1}`] = findSpecValueIdByName(specificationName)
    })

    skuItem.price = item.price * 100
    skuItem.stock_num = item.number
    list.push(skuItem)
  })

  return list
}

const skuAdapter = () => {
  skuData.value = {
    tree: setSkuTree(),
    list: setSkuList(),
    price: parseInt(goods.value.info.retailPrice, 10),
    stock_num: totalStockNum.value,
    collection_id: '',
    none_sku: false,
    hide_stock: false,
  }

  name.value = '请选择'
  skuGoods.value = {
    title: goods.value.info.name,
    goodsId: goods.value.info.id,
    picture: goods.value.info.picUrl,
    specificationList: goods.value.specificationList,
    productList: goods.value.productList,
  }
}

const getGoodsDetail = () => {
  getDetail(props.goodsId).then((res) => {
    const goodsData = res.data
    attributes.value = goodsData.attributes
    goods.value = goodsData
    info.value = goodsData.info
    banner.value = goodsData.info.gallery
    description.value = goodsData.info.detail
    totalStockNum.value = goodsData.productList.reduce((total, current) => {
      return total + (current.number || 0)
    }, 0)

    skuAdapter()
    isSkeletonShow.value = false
    wxShare(goodsData.info)
  })
}

const getCommentInfo = async () => {
  const tagRes = await getCommentTagNum({ goodsId: props.goodsId })
  const listRes = await getCommentList({ tagType: 0, goodsId: props.goodsId })
  const commentTagNum = tagRes.data

  let goodsRate = Math.ceil((commentTagNum.goodsNum / commentTagNum.totalNum) * 100)
  goodsRate = Number.isNaN(goodsRate) ? 0 : goodsRate

  comment.value = {
    rate: goodsRate,
    num: `${commentTagNum.totalNum}`,
    tags: [
      '全部',
      `好评(${commentTagNum.goodsNum})`,
      `中评(${commentTagNum.middleNum})`,
      `差评(${commentTagNum.badNum})`,
      `有图(${commentTagNum.hasPictureNum})`,
    ],
    list: listRes.data.records.slice(0, 2),
  }
}

const getNum = () => {
  tabbar.value?.getCartCount()
}

const initSku = ({ skuValue, selectedSku }) => {
  const nextInitialSku = { ...initialSku.value }

  Object.keys(selectedSku).forEach((key) => {
    nextInitialSku[key] = selectedSku[key]
    if (skuValue.skuKeyStr === key) {
      nextInitialSku[`${key}name`] = selectedSku[key] ? skuValue.name : ''
    }
  })

  initialSku.value = nextInitialSku

  const nameArr = Object.keys(nextInitialSku)
    .filter((key) => key.includes('name') && nextInitialSku[key])
    .map((key) => nextInitialSku[key])

  name.value = nameArr.join('，') || '请选择'
}

const initSkuNum = (num) => {
  stockNum.value = num
  initialSku.value.selectedNum = num
}

onMounted(() => {
  getGoodsDetail()
  getCommentInfo()
  handleGetMallConfig()
})
</script>

<style lang="scss" scoped>
.detail {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>
