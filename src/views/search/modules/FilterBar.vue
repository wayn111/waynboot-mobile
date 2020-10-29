<template>
  <div class="search-filter">
    <van-dropdown-menu style="flex:1">
      <van-dropdown-item v-model="value1" :options="option1" @change="change1" />
      <!-- <van-dropdown-item v-model="value2" :options="option2" />
      <van-dropdown-item v-model="value3" :options="option3" /> -->
    </van-dropdown-menu>
    <div class="filter" @click="chageSales">
      <span style="font-size:15px;margin-right:2px">销量</span>
    </div>
    <div class="filter" @click="changeFaIcon">
      <span style="font-size:15px;margin-right:2px">价格</span>
      <font-awesome-icon :icon="faDefault" size="3x" />
    </div>
    <div class="filter">
      <span style="font-size:15px;margin-right:2px">筛选</span>
      <van-icon size="12" name="filter-o" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: '',
      option1: [
        { text: '综合', value: '' },
        { text: '新品上架', value: 'isNew' },
        { text: '人气推荐', value: 'isHot' }
      ],
      faDefault: ['fas', 'sort'],
      faSort: ['fas', 'sort'],
      faSortUp: ['fas', 'sort-up'],
      faSortDown: ['fas', 'sort-down'],
      faCount: 0
    }
  },
  methods: {
    change1(value) {
      this.$emit('changeGoods', { search: value })
    },
    changeFaIcon() {
      this.faCount++
      if (this.faCount === 3) {
        this.faCount = 0
      }
      if (this.faCount === 0) {
        this.$emit('changeGoods', { search: 'cancelPrice' })
        this.faDefault = this.faSort
      } else if (this.faCount === 1) {
        this.$emit('changeGoods', { search: 'price', orderBy: 'asc' })
        this.faDefault = this.faSortUp
      } else if (this.faCount === 2) {
        this.faDefault = this.faSortDown
        this.$emit('changeGoods', { search: 'price', orderBy: 'desc' })
      }
    },
    chageSales() {
      this.$emit('changeGoods', { search: 'isSales' })
    }

  }
}
</script>

<style lang="scss" >
// reset vant css
.search-filter {
  .van-hairline--top-bottom::after,
  .van-hairline-unset--top-bottom::after {
    border: none;
  }
}
</style>

<style lang="scss" scoped>
.search-filter {
  font-size: 10px;
  display: flex;
  flex-direction: row;
  border-top: 1px solid #f5f5f5;
  border-bottom: 1px solid #f5f5f5;
  .filter {
    flex-basis: 25%;
    color: #323233;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
