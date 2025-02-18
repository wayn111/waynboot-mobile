<template>
  <div class="coupon">
    <nav-bar :title="$route.meta.title" />

    <van-list
      v-model="isLoading"
      :finished="isFinished"
      finished-text="没有更多了"
      :immediate-check="false"
      @load="onReachBottom"
    >
      <div class="main">
        <div v-for="(item, i) in goodsList" :key="i" class="content">
          <div class="left">
            <div class="title">{{ item.discount }}元{{ item.title }}</div>
            <div class="desc">最低消费{{ item.min }}可用</div>
          </div>
          <van-button v-if="item.receiveStatus" class="btnInfo" type="info">已领取</van-button>
          <van-button v-else type="info" @click="onSubmit(item.id)">领取</van-button>

        </div>

      </div>
    </van-list>
  </div>
</template>

<script>
import { orderCoupon, orderReceive } from '@/api/order'
import { getToken } from '@/utils/auth' // get token from cookie
import { Dialog } from 'vant'
import store from '@/store'
import router from '@/router'
export default {
  components: {
  },
  model: {
    prop: 'isLoading'
  },
  data() {
    return {
      goodsList: [],
      isLoading: false,
      isFinished: false,
      pageSize: 10,
      pageNum: 1
    }
  },

  computed: {
    loading: {
      get() {
        return this.isLoading
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  mounted() {
    this.getOrderCouponList()
  },
  methods: {
    getOrderCouponList() {
      orderCoupon({
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }).then(res => {
        const { records } = res.data
        if (this.pageNum === 1) {
          this.goodsList = records
        } else {
          this.goodsList = [...this.goodsList, ...records]
        }

        this.isLoading = false
        if (records.length < this.pageSize && this.goodsList.length > 0) {
          this.isFinished = true
        }
      })
    },
    onReachBottom() {
      this.pageNum += 1
      this.getOrderCouponList()
    },
    onSubmit(id) {
      const hasToken = getToken()
      if (!hasToken) {
        Dialog.alert({
          title: '提示',
          message: '您还未登录，请登录'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            router.push({ name: 'Login' })
          })
        })
      } else {
        orderReceive({ couponId: id }).then(res => {
          if (res.code === 200) {
            this.pageNum = 1
            this.getOrderCouponList()
            this.$toast('已领取')
          } else {
            this.$toast(res.msg)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.coupon {
    background: #f5f5f5;
    min-height: 100vh;

    .content {
        margin: 20px 30px;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 30px;
        border-radius: 10px;

        .left {
            display: flex;

            flex-direction: column;
            justify-content: center;

            .title {
                font-weight: bold;
                font-size: 36px;
                color: #000;
                line-height: 70px;
            }

            .desc {
                font-size: 24px;
                color: #666;
                line-height: 50px;
            }
        }

        .van-button--info {
            border-radius: 20px;
            height: 70px;
        }

    }

    .btnInfo{
        background: #999;
        border:none;
    }
}
</style>
