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

    <Section :stock-num="stockNum" :name="name" :attr="attributes" @input="isSkuShow = $event" />

    <Comment :rate="comment.rate" :num="comment.num" :tags="comment.tags" :list="comment.list" />

    <Description :description="description" />

    <Sku v-if="isSkuShow" v-model="isSkuShow" :sku-data="skuData" :goods="skuGoods" :initial-sku="initialSku" @initSku="initSku($event)" @getNum="getNum" @initSkuNum="initSkuNum($event)" />

    <Tabbar ref="tabbar" @input="isSkuShow = $event" />
    <back-top />
    <Skeleton v-if="isSkeletonShow" />
  </div>
</template>

<script>
import { getDetail } from '@/api/detail'
import Swiper from './modules/Swiper'
import Overview from './modules/Overview'
import Section from './modules/Section'
import Comment from './modules/Comment'
import Description from './modules/Description'
import Tabbar from './modules/Tabbar'
import Sku from './modules/Sku'
import Skeleton from './modules/Skeleton'
import _ from 'lodash'

export default {
  name: 'Detail',
  components: {
    Swiper,
    Overview,
    Section,
    Comment,
    Description,
    Tabbar,
    Sku,
    Skeleton
  },
  // eslint-disable-next-line vue/require-prop-types
  props: {
    goodsId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      banner: [],
      goods: {},
      info: {},
      name: '',
      stockNum: 1,
      attributes: [],
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
    this.getGoodsDetail()
  },
  methods: {
    getGoodsDetail() {
      getDetail(this.goodsId).then((res) => {
        const goods = res.map
        this.attributes = goods.attributes
        this.goods = goods
        this.info = goods.info
        this.banner = goods.info.gallery
        this.description = goods.info.picUrl
        this.skuAdapter()
        this.isSkeletonShow = false
        this.comment = {
          rate: '99%',
          num: '10万+',
          tags: [
            '品质一流',
            '图文清晰',
            '印刷上乘',
            '质地上乘',
            '优美详细'
          ],
          list: [
            {
              avatar:
                    'http://storage.360buyimg.com/i.imageUpload/6a645f3437323632613465313233613831353834393333353237363232_sma.jpg',
              time: 1585537881825,
              score: 5,
              name: 'Ewall&熊猫',
              desc:
                    '收到货就赶紧打开看起来了，之前看过电子版的看完之后感到意犹未尽，前两天突然想再看一遍于是决定买实体书认真读一遍。',
              imgs: [
                'http://img30.360buyimg.com/shaidan/s128x96_jfs/t1/91400/14/15534/116833/5e723705E6e97e5a3/012d7444f8ccbcea.jpg',
                'http://img30.360buyimg.com/shaidan/s128x96_jfs/t1/91314/13/15486/245367/5e723706E663c43aa/abb31350cdadf56d.jpg',
                'http://img30.360buyimg.com/shaidan/s128x96_jfs/t1/103902/15/15108/267864/5e703d09E6603898f/4d91ad6fab4f76e0.jpg'
              ]
            },
            {
              avatar:
                    'http://img11.360buyimg.com/jdphoto/s40x40_jfs/t1/25255/18/10701/1678/5c89f892E78c04688/684d63c0d68e39b1.png',
              time: 1585537881825,
              score: 2,
              name: '张三',
              desc:
                    '很好很好很好！久仰大名，如雷贯耳的刘慈欣的大作，终于在京东上买到了，用了3000京豆后，才39元到手，高兴😃。包装很好很好很好很好！纸张很好，印刷清晰，岁数大了看着也不累，很好。一直都在京东买东西，十几年了，京东的服务一直很好！快递更是给力，小哥很棒！',
              imgs: [
                'http://img30.360buyimg.com/shaidan/s128x96_jfs/t1/110454/9/7862/139882/5e61d739E6a4360d2/a2dc1ac0d8f680a9.jpg',
                'http://img30.360buyimg.com/shaidan/s128x96_jfs/t1/98014/37/12422/125922/5e478009E5acab40d/dbf006d20d040c8b.jpg',
                'http://img30.360buyimg.com/shaidan/s128x96_jfs/t1/93964/32/13999/287674/5e61d73bE7e2430bd/de2bcdb6ab83f037.jpg'
              ]
            }
          ]
        }
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
