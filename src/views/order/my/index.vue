<template>
    <div class="coupon">
        <nav-bar :title="$route.meta.title" />

        <van-list v-model="isLoading" :finished="isFinished" finished-text="没有更多了" :immediate-check="false"
            @load="onReachBottom">
            <div class="main">
                <div v-for="(item, i) in goodsList" :key="i" class="content">
                    <div class="left">
                        <div class="title">{{ item.discount }}元{{ item.title }}</div>
                        <div class="desc">最低消费{{ item.min }}可用</div>
                    </div>
                    <div class="right" v-if="item.useStatus == 1">已使用</div>
                    <div class="right" v-if="item.useStatus == 2">已过期</div>
                    <div class="noUser"  v-if="!item.useStatus">未使用</div>
                </div>
            </div>
        </van-list>
    </div>
</template>

<script>
import { orderCouponMy } from '@/api/order'
import { getToken } from '@/utils/auth' // get token from cookie
import { Toast, Dialog } from 'vant'
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
            pageNum: 1,
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
        this.getOrderCouponMyList()
    },
    methods: {
        getOrderCouponMyList() {
            orderCouponMy({
                pageSize: this.pageSize,
                pageNum: this.pageNum
            }).then(res => {
                const { records } = res.data
                if(this.pageNum == 1){
                    this.goodsList = records
                }else{
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
            this.getOrderCouponMyList()
        },
        onSubmit(id) {
           
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

        .right {
            color:#ce4141;
            font-size: 32px;
        }
        .noUser{
            color:rgb(68, 178, 238);
            font-size: 32px;
        }

    }
}
</style>