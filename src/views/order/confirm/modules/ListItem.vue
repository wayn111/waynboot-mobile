<template>
  <div class="list-item">
    <h3 class="title">
      <van-icon name="shop-o" />
      <span class="title__name">熊猫商城自营</span>
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
        <span class="red">{{ amount }} 元</span>
      </van-cell>
      <van-cell title="邮费">
        <span class="red">0 元</span>
      </van-cell>
      <van-cell title="优惠券">
        <span class="red">不可用</span>
      </van-cell>
      <van-field v-model="message" placeholder="请输入备注" label="订单备注">
        <template slot="icon">{{ 500 }}/50</template>
      </van-field>
    </van-cell-group>

    <van-submit-bar
      :price="amount * 100"
      label="总计："
      button-text="提交订单"
      :disabled="false"
      @submit="onSubmit"
    />
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
      amount: 0,
      goodsList: [],
      orderSn: undefined,
      actualPrice: 0,
      retryCount: 6, // 查询订单结果次数
      retryInterval: 300 // 查询间隔
    }
  },
  computed: {
    ...mapGetters(['selectedAddress', 'id'])
  },
  activated() {
    // 对于使用了keep-alive的组件
    // 使用activated这个生命周期钩子刷新地址
    this.getGoodsList()
  },
  methods: {
    getGoodsList() {
      this.goodsList = []
      getCheckedGoods().then((res) => {
        const { data, amount } = res.map
        this.goodsList = data
        this.amount = amount
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
      const message = this.message
      const userId = this.id
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '下单中，请稍后'
      })
      this.retryCount = 6
      submit({ cartIdArr, addressId, userId, message }).then((res) => {
        const { orderSn, actualPrice } = res.map
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
        console.log('下单失败', error)
        setTimeout(async() => {
          this.retryCount--
          if (this.retryCount > 0) {
            await this.searchResult(this.orderSn)
          } else {
            this.$toast.fail('抱歉，创建订单失败！')
          }
        }, this.retryInterval)
      }
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
</style>
