<template>
  <div class="payment">
    <nav-bar title="购物车" />
    <!-- closeable 模式，在右侧显示关闭按钮 -->
    <van-notice-bar mode="closeable">请在半小时内完成付款，否则系统自动取消订单</van-notice-bar>

    <van-cell-group class="payment_group">
      <van-cell title="订单编号" :value="order.orderSn" />
      <van-cell title="实付金额">
        <span class="red">{{order.actualPrice | yuan}}</span>
      </van-cell>
    </van-cell-group>

    <div class="pay_way_group">
      <div class="pay_way_title">选择支付方式</div>
      <van-radio-group v-model="payWay">
        <van-cell-group>
          <van-cell>
            <template slot="title">
              <img src="../../../assets/images/ali_pay.png" alt="支付宝" width="82" height="29" />
            </template>
            <van-radio name="ali" />
          </van-cell>
          <van-cell>
            <template slot="title">
              <img src="../../../assets/images/wx_pay.png" alt="微信支付" width="113" height="23" />
            </template>
            <van-radio name="wx" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>

    <van-button class="pay_submit" @click="pay" type="primary" bottomAction>去支付</van-button>
  </div>
</template>

<script>
import { orderDetail, orderPrepay, orderH5pay } from '@/api/order'
import _ from 'lodash'
import { getLocalStorage, setLocalStorage } from '@/utils/localStorage'

export default {
  name: 'payment',

  data() {
    return {
      payWay: 'wx',
      order: {},
      orderId: 0
    }
  },
  created() {
    if (_.has(this.$route.params, 'orderId')) {
      this.orderId = this.$route.params.orderId
      this.getOrder(this.orderId)
    }
  },
  methods: {
    getOrder(orderId) {
      orderDetail({ orderId }).then((res) => {
        this.order = res.map.data
      })
    },
    pay() {
      this.$dialog.alert({
        message:
          '你选择了' + (this.payWay === 'wx' ? '微信支付' : '支付宝支付')
      }).then(() => {
        if (this.payWay === 'wx') {
          const ua = navigator.userAgent.toLowerCase()
          const isWeixin = ua.indexOf('micromessenger') !== -1
          if (isWeixin) {
            orderPrepay({ orderId: this.orderId })
              .then((res) => {
                const data = res.data.data
                const prepayData = JSON.stringify({
                  appId: data.appId,
                  timeStamp: data.timeStamp,
                  nonceStr: data.nonceStr,
                  package: data.packageValue,
                  signType: 'MD5',
                  paySign: data.paySign
                })
                setLocalStorage({ prepay_data: prepayData })

                if (typeof WeixinJSBridge === 'undefined') {
                  if (document.addEventListener) {
                    document.addEventListener(
                      'WeixinJSBridgeReady',
                      this.onBridgeReady,
                      false
                    )
                  } else if (document.attachEvent) {
                    document.attachEvent(
                      'WeixinJSBridgeReady',
                      this.onBridgeReady
                    )
                    document.attachEvent(
                      'onWeixinJSBridgeReady',
                      this.onBridgeReady
                    )
                  }
                } else {
                  this.onBridgeReady()
                }
              })
              .catch((err) => {
                this.$dialog.alert({ message: err.map.msg })
                this.$router.replace({
                  name: 'paymentStatus',
                  params: {
                    status: 'failed'
                  }
                })
              })
          } else {
            orderH5pay({ orderId: this.orderId })
              .then((res) => {
                const data = res.data.data
                window.location.replace(
                  data.mwebUrl +
                    '&redirect_url=' +
                    encodeURIComponent(
                      window.location.origin +
                        '/#/?orderId=' +
                        this.orderId +
                        '&tip=yes'
                    )
                )
              })
              .catch((err) => {
                this.$dialog.alert({ message: '支付失败' })
                this.$router.replace({
                  name: 'PayStatus',
                  params: {
                    status: 'failed'
                  }
                })
              })
          }
        } else {
          // todo : alipay
        }
      })
    },
    onBridgeReady() {
      const that = this
      const data = getLocalStorage('prepay_data')
      // eslint-disable-next-line no-undef
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        JSON.parse(data.prepay_data),
        function (res) {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            that.$router.replace({
              name: 'paymentStatus',
              params: {
                status: 'success'
              }
            })
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            that.$router.replace({
              name: 'paymentStatus',
              params: {
                status: 'cancel'
              }
            })
          } else {
            that.$router.replace({
              name: 'paymentStatus',
              params: {
                status: 'failed'
              }
            })
          }
        }
      )
    }
  }

}
</script>

<style lang="scss" scoped>
$mb2vw: 2vw;
.payment {
  min-height: 100vh;
  background: #f5f5f5;

  .van-notice-bar {
    margin-bottom: $mb2vw
  }

  .payment_group {
    margin-bottom: $mb2vw
  }

  .pay_submit {
    position: fixed;
    bottom: 0;
    width: 100%;
  }

  .pay_way_group img {
    vertical-align: middle;
  }

  .pay_way_title {
    padding: 5vw 4vw;
    background-color: #fff;
  }
}
</style>
