<template>
  <div class="search-filter">
    <van-dropdown-menu style="flex: 1">
      <van-dropdown-item
        v-model="value1"
        :options="option1"
        @change="change1"
      />
    </van-dropdown-menu>
    <div class="filter" @click="chageSales">
      <span style="font-size: 15px; margin-right: 2px">销量</span>
    </div>
    <div class="filter" @click="changeFaIcon">
      <span style="font-size: 15px; margin-right: 2px">价格</span>
      <font-awesome-icon :icon="faDefault" size="3x" />
    </div>
    <van-dropdown-menu style="flex: 0.5">
      <van-dropdown-item ref="item" title="筛选">
        <van-cell center title="新品">
          <template #right-icon>
            <van-switch v-model="switch1" size="24" @change="filterNew" />
          </template>
        </van-cell>
        <van-cell center title="热品">
          <template #right-icon>
            <van-switch v-model="switch2" size="24" @change="filterHot" />
          </template>
        </van-cell>
      </van-dropdown-item>
    </van-dropdown-menu>
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'


const emit = defineEmits(['changeGoods'])

const state = reactive({value1: '',
      switch1: false,
      switch2: false,
      option1: [
        { text: '综合推荐', value: '' },
        { text: '新品上架', value: 'isNew' },
        { text: '人气推荐', value: 'isHot' },
      ],
      faDefault: ['fas', 'sort'],
      faSort: ['fas', 'sort'],
      faSortUp: ['fas', 'sort-up'],
      faSortDown: ['fas', 'sort-down'],
      faCount: 0,})
const { value1, switch1, switch2, option1, faDefault, faSort, faSortUp, faSortDown, faCount } = toRefs(state)

const change1 = (value) => {
  emit('changeGoods', { search: value })
}

const changeFaIcon = () => {
  faCount.value++
      if (faCount.value === 3) {
        faCount.value = 0
      }
      if (faCount.value === 0) {
        emit('changeGoods', { search: 'cancelPrice' })
        faDefault.value = faSort.value
      } else if (faCount.value === 1) {
        emit('changeGoods', { search: 'price', orderBy: 'asc' })
        faDefault.value = faSortUp.value
      } else if (faCount.value === 2) {
        faDefault.value = faSortDown.value
        emit('changeGoods', { search: 'price', orderBy: 'desc' })
      }
}

const chageSales = () => {
  emit('changeGoods', { search: 'isSales' })
}

const filterNew = (val) => {
  if (val) {
        emit('changeGoods', { search: 'filterNew', val: true })
      } else {
        emit('changeGoods', { search: 'filterNew', val: false })
      }
}

const filterHot = (val) => {
  if (val) {
        emit('changeGoods', { search: 'filterHot', val: true })
      } else {
        emit('changeGoods', { search: 'filterHot', val: false })
      }
}
</script>

<style lang="scss">
/*// reset vant css
*/
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
