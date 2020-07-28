<template>
  <div class="home-goods">
    <Title :name="titleName" style="background:#fff" />

    <van-list
      v-model="loading"
      :finished="true"
      @load="onReachBottom"
      :immediate-check="false"
    >
      <div class="main">
        <goods-item
          v-for="(item,idx) in goodsList"
          :key="idx"
          :img="item.picUrl"
          :title="item.name"
          :desc="item.desc"
          :price="item.retailPrice"
          :discount="item.counterPrice"
        />
      </div>
    </van-list>
  </div>
</template>

<script>
import Title from './Title'
import GoodsItem from '@/components/GoodsItem'

export default {
  model: {
    prop: 'isLoading'
  },
  props: {
    goodsList: Array,
    titleName: String,
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    GoodsItem,
    Title
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
  methods: {
    onReachBottom() {
      this.$emit('onReachBottom')
    }
  }
}
</script>

<style lang="scss" scoped>
.home-goods {
  margin-top: 24px;
  .main {
    background: #fff;
    box-sizing: border-box;
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
  }
}
</style>
