<template>
  <div class="home-goods">
    <Title :name="titleName" style="background: #fff" />

    <van-list
      v-model="loading"
      :finished="isFinished"
      finished-text="没有更多了"
      :immediate-check="false"
      @load="onReachBottom"
    >
      <div class="main">
        <van-card
          v-for="(item, i) in goodsList"
          :key="i"
          :desc="item.brief"
          :title="item.name"
          :thumb="item.picUrl"
          :price="item.retailPrice | yuan"
          :origin-price="item.counterPrice | yuan"
          @click="itemClick(item.id)"
        />
      </div>
    </van-list>
  </div>
</template>

<script>
import Title from './Title'

export default {
  components: {
    Title
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
    },
    isFinished: {
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
    },
    itemClick(goodsId) {
      this.$router.push({
        path: `/detail/${goodsId}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home-goods {
  margin-top: 24px;
  .main {
    background: #fff;
  }
}
</style>
