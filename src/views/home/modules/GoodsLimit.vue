<template>
  <div class="home-goods">
    <van-cell :title="titleName" is-link to="index" :value="'更多' + titleName" />
    <van-list
      v-model="loading"
      :finished="true"
      :immediate-check="false"
      @load="onReachBottom"
    >
      <div class="main">
        <goods-item
          v-for="(item,idx) in goodsList"
          :key="idx"
          :goods-id="item.id"
          :img="item.picUrl"
          :title="item.name"
          :desc="item.brief"
          :price="item.retailPrice"
          :discount="item.counterPrice"
        />
      </div>
    </van-list>
  </div>
</template>

<script>
// import Title from './Title'
import GoodsItem from '@/components/GoodsItem'

export default {
  components: {
    GoodsItem
  },
  model: {
    prop: 'isLoading'
  },
  props: {
    goodsList: {
      type: Array,
      default() {
        return []
      }
    },
    titleName: {
      type: String,
      default: ''
    },
    isLoading: {
      type: Boolean,
      default: false
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
  methods: {
    onReachBottom() {
      this.$emit('onReachBottom')
    }
  }
}
</script>

<style lang="scss" scoped>
.home-goods {
  margin-top: 12px;
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
