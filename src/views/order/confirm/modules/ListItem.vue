<template>
  <div class="list-item">
    <h3 class="title">
      <van-icon name="shop-o" />
      <span class="title__name">商城自营</span>
    </h3>
    <div v-for="(item, idx) in goodsList" :key="idx" class="item">
      <image-pic width="80" height="80" fit="fill" :src="item.picUrl" />
      <div class="item__main">
        <p class="item__main__desc van-multi-ellipsis--l2">
          {{ item.goodsName }}
        </p>
        <p class="item__main__attr">
          <span
            v-for="(specification, index) in item.specifications"
            :key="index"
          >{{ specification }}</span>
        </p>
      </div>
      <div class="item__price">
        <span class="item__price__price">¥{{ item.price }}</span>
        <span class="item__price__count">x{{ item.number }}</span>
      </div>
    </div>
    <van-cell-group>
      <van-cell title="商品金额">
        <span class="red">{{ goodsAmount }} 元</span>
      </van-cell>
      <van-cell title="运费">
        <span class="red">{{ freightPrice }} 元</span>
      </van-cell>
      <van-cell title="优惠券" @click="showPicker = true">
        <span class="red" v-if="chooseInfo && chooseInfo.id">-{{  chooseInfo.discount }}元</span>
        <span class="red" v-else>{{ couponList.length }}张可用 </span>
      </van-cell>
      <van-field v-model="message" placeholder="请输入备注" label="订单备注">
        <template slot="icon">{{ 500 }}/50</template>
      </van-field>
    </van-cell-group>

    <van-submit-bar
      :price="orderTotalAmount * 100"
      label="总计："
      button-text="提交订单"
      :disabled="false"
      @submit="onSubmit"
    >
    <span class="tipsCoupon" v-if="chooseInfo && chooseInfo.id">已优惠-{{  chooseInfo.discount }}元</span>
    </van-submit-bar>
    <van-popup v-model="showPicker" position="bottom">
  <van-picker
    show-toolbar
    :columns="couponList"
    @cancel="showPicker = false"
    @confirm="onConfirm"
  />
</van-popup>
  </div>
</template>

<script>
import { getCheckedGoods } from '@/api/cart'
import { mapGetters } from 'vuex'
import { submit, searchResult } from '@/api/order'
export default {
  data() {
    return {
      message: '',
      goodsAmount: 0,
      orderTotalAmount: 0,
      goodsList: [],
      orderSn: undefined,
      actualPrice: 0,
      freightPrice: 0,
      retryCount: 10, // 查询订单结果次数
      retryInterval: 600, // 查询间隔
      showPicker:false,
      couponList: [],
      chooseInfo:{},
      couponListCopy:[]
    }
  },
  computed: {
    ...mapGetters(['selectedAddress', 'id'])
  },
  activated() {
    // 对于使用了keep-alive的组件
    // 使用activated这个生命周期钩子刷新地址
    this.getGoodsList()
    this.message = ''
  },
  methods: {
    getGoodsList() {
      this.goodsList = []
      getCheckedGoods().then((res) => {
        const { data, orderTotalAmount, goodsAmount, freightPrice, couponList } = res.data
        this.goodsList = data
        this.goodsAmount = goodsAmount
        this.orderTotalAmount = orderTotalAmount
        this.freightPrice = freightPrice
        this.couponListCopy = couponList
        this.couponList = couponList.length > 0 ? couponList.map(item=>item.discount+'元'+item.title) : []
      })
    },
    onSubmit() {
      const addressId = this.selectedAddress.id
      if (!addressId) {
        return this.$toast.fail('请选择地址')
      }
      const cartIdArr = this.goodsList.map((item) => {
        return item.id
      })
      const userCouponId = this.chooseInfo && this.chooseInfo.id ? this.chooseInfo.id : undefined
      const message = this.message
      const userId = this.id
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '下单中，请稍后'
      })
      this.retryCount = 6
      submit({ cartIdArr, addressId, userId, message , userCouponId}).then((res) => {
        const { orderSn, actualPrice } = res.data
        this.orderSn = orderSn
        this.actualPrice = actualPrice
        setTimeout(() => {
          this.searchResult()
        }, this.retryInterval)
      })
    },
    /**
     * 查询下单是否成功
     */
    async searchResult() {
      try {
        await searchResult(this.orderSn)
        this.$toast.clear()
        this.$router.push({
          name: 'OrderPay',
          params: { orderSn: this.orderSn, actualPrice: this.actualPrice }
        })
      } catch (error) {
        setTimeout(async() => {
          this.retryCount--
          if (this.retryCount > 0) {
            await this.searchResult(this.orderSn)
          } else {
            console.log('下单失败', error)
            this.$toast.fail(error.message)
          }
        }, this.retryInterval)
      }
    },
    onConfirm(val,index){
      this.showPicker = false
      this.chooseInfo = this.couponListCopy[index]
      this.orderTotalAmount = this.goodsAmount + this.freightPrice - this.chooseInfo.discount
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.list-item {
  box-sizing: border-box;
  width: 100%;
  background: #fff;
  padding: 24px;
  margin-top: 24px;
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    .title__name {
      margin-left: 18px;
      font-size: $small;
      color: $black;
    }
  }
  .item {
    position: relative;
    margin-top: 34px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .item__main {
      box-sizing: border-box;
      flex-grow: 1;
      height: 160px;
      display: flex;
      flex-direction: column;
      padding: 0 24px;
      .item__main__desc {
        line-height: 30px;
        font-size: $mini;
        color: $black;
        text-align: justify;
      }
      .item__main__attr {
        margin-top: 12px;
        span {
          display: inline-block;
          background: #f7f7f7;
          border-radius: 6px;
          padding: 6px;
          font-size: $mini;
          color: $gray;
          margin-right: 6px;
        }
      }
      .item__main__id {
        margin-top: 12px;
        font-size: $mini;
        color: $gray;
      }
    }
    .item__price {
      width: 100px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      .item__price__price {
        font-size: $mini;
        color: $black;
      }
      .item__price__count {
        font-size: $mini;
        color: $gray;
        margin-top: 12px;
      }
    }
  }
}
.tipsCoupon{
  margin-top:5px;
}
</style>
