<template>
  <div class="goods-item" @click="onNavigate">
    <div class="pic">
      <image-pic
        fill="cover"
        align="center"
        width="150"
        height="150"
        :src="img"
      />
    </div>
    <p class="title">{{ title }}</p>
    <!-- <p class="desc">{{ desc }}</p> -->
    <div class="num">
      <span class="num__now">¥</span>{{ price | yuan }}
      <!-- <span class="num__old">¥{{ discount | yuan }}</span> -->
    </div>
    <div class="desc">
      已售：{{ virtualSales || 0 }}
    </div>
    <!-- <div class="btn-wrapper">
      <van-button class="btn" size="small">立即购买</van-button>
    </div> -->
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['goodsId', 'img', 'title', 'desc', 'price', 'discount', 'virtualSales'],
  methods: {
    onNavigate() {
      this.$router.push({
        path: `/detail/${this.goodsId}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.goods-item {
  position: relative;
  width: 360px;
  overflow: hidden;
  border-top:1px solid #ebedf0;
  border-right: 1px solid #ebedf0;
  display: flex;
  flex-direction: column;
  align-items: center;
  &:nth-child(2n+2){
    border-right:none;
  }
  .pic {
    display: block;
    padding: 14px;
    // background: #f5f5f5;
  }
  .title {
    margin-bottom: 10px;
    height:66px;
    max-width: 320px;
    font-size: $small;
    color: $black;
    text-align: center;
    @include text-multiple-ellipsis;
  }
  .desc {
    padding: 14px;
    padding-top: 0;
    font-size: $small;
    color: $gray;
    text-align: center;
    @include text-ellipsis;
  }
  .num {
    padding-bottom: 25px;
    text-align: center;
    font-size: 36px;
    color: $black;
    font-weight: 500;
    text-decoration-line: underline;
    text-decoration-color: #969799;
    .num__now {
      font-family: DIN-Medium, DIN;
      font-size: 24px;
    }
    .num__old {
      font-family: DIN-Medium, DIN;
      font-size: 24px;
      font-weight: 400;
      color: $gray;
      text-decoration: line-through;
      margin-right: 10px;
    }
  }
  .btn-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-bottom: 24px;
    .btn {
      background: $red;
      color: #fff;
      border: none;
    }
  }
}
</style>
