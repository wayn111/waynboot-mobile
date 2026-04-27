<template>
  <div class="search-filter">
    <button
      type="button"
      class="search-filter__chip search-filter__chip--wide"
      :class="{ 'search-filter__chip--active': !salesActive && priceState === 0 }"
      @click="showSortSheet = true"
    >
      <span>{{ currentSortText }}</span>
      <van-icon name="arrow-down" />
    </button>

    <button
      type="button"
      class="search-filter__chip"
      :class="{ 'search-filter__chip--active': salesActive }"
      @click="chageSales"
    >
      <span>销量</span>
    </button>

    <button
      type="button"
      class="search-filter__chip"
      :class="{ 'search-filter__chip--active': priceState > 0 }"
      @click="changeFaIcon"
    >
      <span>价格</span>
      <van-icon :name="priceIcon" />
    </button>

    <button
      type="button"
      class="search-filter__chip"
      :class="{ 'search-filter__chip--active': switch1 || switch2 }"
      @click="showFilterSheet = true"
    >
      <span>筛选</span>
      <van-icon name="filter-o" />
    </button>

    <van-popup
      v-model:show="showSortSheet"
      position="bottom"
      round
      teleport="body"
      :z-index="3000"
      :overlay-style="overlayStyle"
      class="search-filter__popup"
    >
      <div class="search-filter__handle" />
      <div class="search-filter__popup__header">排序方式</div>

      <div class="search-filter__popup__body">
        <button
          v-for="option in option1"
          :key="option.value"
          type="button"
          class="search-filter__option"
          :class="{ 'search-filter__option--active': value1 === option.value }"
          @click="change1(option.value)"
        >
          <div class="search-filter__option__copy">
            <span class="search-filter__option__title">{{ option.text }}</span>
          </div>
          <span class="search-filter__option__check">
            <van-icon v-if="value1 === option.value" name="success" />
          </span>
        </button>
      </div>
    </van-popup>

    <van-popup
      v-model:show="showFilterSheet"
      position="bottom"
      round
      teleport="body"
      :z-index="3000"
      :overlay-style="overlayStyle"
      class="search-filter__popup"
    >
      <div class="search-filter__handle" />
      <div class="search-filter__popup__header">条件筛选</div>

      <div class="search-filter__popup__body">
        <div class="search-filter__switch-row">
          <div>
            <p class="search-filter__switch-title">新品</p>
          </div>
          <van-switch v-model="switch1" size="28" @change="filterNew" />
        </div>

        <div class="search-filter__switch-row">
          <div>
            <p class="search-filter__switch-title">热品</p>
          </div>
          <van-switch v-model="switch2" size="28" @change="filterHot" />
        </div>
      </div>

      <div class="search-filter__actions">
        <button
          type="button"
          class="search-filter__action search-filter__action--ghost"
          @click="resetFilter"
        >
          重置
        </button>
        <button
          type="button"
          class="search-filter__action search-filter__action--primary"
          @click="showFilterSheet = false"
        >
          完成
        </button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { computed, reactive, toRefs } from 'vue'

const emit = defineEmits(['changeGoods'])

const overlayStyle = {
  background: 'rgba(255, 255, 255, 0.42)',
  backdropFilter: 'blur(2px)',
}

const state = reactive({
  value1: '',
  switch1: false,
  switch2: false,
  salesActive: false,
  priceState: 0,
  showSortSheet: false,
  showFilterSheet: false,
  option1: [
    {
      text: '综合推荐',
      value: '',
    },
    {
      text: '新品上架',
      value: 'isNew',
    },
    {
      text: '人气推荐',
      value: 'isHot',
    },
  ],
})

const {
  value1,
  switch1,
  switch2,
  salesActive,
  priceState,
  showSortSheet,
  showFilterSheet,
  option1,
} = toRefs(state)

const currentSortText = computed(() => {
  return option1.value.find((item) => item.value === value1.value)?.text || '综合推荐'
})

const priceIcon = computed(() => {
  if (priceState.value === 1) {
    return 'ascending'
  }

  if (priceState.value === 2) {
    return 'descending'
  }

  return 'exchange'
})

const change1 = (value) => {
  value1.value = value
  salesActive.value = false
  priceState.value = 0
  showSortSheet.value = false
  emit('changeGoods', { search: value })
}

const changeFaIcon = () => {
  value1.value = ''
  salesActive.value = false
  priceState.value = (priceState.value + 1) % 3

  if (priceState.value === 0) {
    emit('changeGoods', { search: 'cancelPrice' })
  } else if (priceState.value === 1) {
    emit('changeGoods', { search: 'price', orderBy: 'asc' })
  } else if (priceState.value === 2) {
    emit('changeGoods', { search: 'price', orderBy: 'desc' })
  }
}

const chageSales = () => {
  value1.value = ''
  priceState.value = 0
  salesActive.value = true
  emit('changeGoods', { search: 'isSales' })
}

const filterNew = (val) => {
  emit('changeGoods', { search: 'filterNew', val })
}

const filterHot = (val) => {
  emit('changeGoods', { search: 'filterHot', val })
}

const resetFilter = () => {
  switch1.value = false
  switch2.value = false
  emit('changeGoods', { search: 'filterNew', val: false })
  emit('changeGoods', { search: 'filterHot', val: false })
  showFilterSheet.value = false
}
</script>

<style lang="scss" scoped>
.search-filter {
  position: sticky;
  top: 0;
  z-index: 8;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px 18px;
  overflow-x: auto;
  background: linear-gradient(180deg, rgba(245, 245, 247, 0.96), rgba(245, 245, 247, 0.72) 78%, transparent);
  backdrop-filter: blur(18px);
  scrollbar-width: none;
}

.search-filter::-webkit-scrollbar {
  display: none;
}

.search-filter__chip {
  flex: none;
  min-width: 98px;
  min-height: 56px;
  padding: 0 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid rgba(210, 210, 215, 0.72);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.94);
  color: #1d1d1f;
  white-space: nowrap;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
  font-size: 28px;
}

.search-filter__chip--wide {
  min-width: 176px;
}

.search-filter__chip--active {
  border-color: #0071e3;
  background: #0071e3;
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(0, 113, 227, 0.18);
}

.search-filter__popup {
  padding: 14px 24px calc(28px + env(safe-area-inset-bottom, 0px));
  background: #f5f5f7;
}

.search-filter__handle {
  width: 76px;
  height: 10px;
  margin: 4px auto 18px;
  border-radius: 999px;
  background: rgba(29, 29, 31, 0.16);
}

.search-filter__popup__header {
  font-size: 40px;
  line-height: 1.12;
  font-weight: 600;
  color: #1d1d1f;
}

.search-filter__popup__body {
  margin-top: 18px;
}

.search-filter__option {
  width: 100%;
  min-height: 88px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid rgba(210, 210, 215, 0.72);
  border-radius: 28px;
  background: #ffffff;
  text-align: left;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.05);
}

.search-filter__option + .search-filter__option {
  margin-top: 14px;
}

.search-filter__option__copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.search-filter__option__title {
  font-size: 34px;
  line-height: 1.18;
  font-weight: 600;
  color: #1d1d1f;
}

.search-filter__option__check {
  width: 46px;
  height: 46px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid rgba(29, 29, 31, 0.12);
  color: #0071e3;
}

.search-filter__option--active {
  border-color: rgba(0, 113, 227, 0.28);
  background: rgba(0, 113, 227, 0.06);
  box-shadow: inset 0 0 0 1px rgba(0, 113, 227, 0.12);
}

.search-filter__option--active .search-filter__option__title {
  color: #0071e3;
}

.search-filter__option--active .search-filter__option__check {
  border-color: #0071e3;
}

.search-filter__switch-row {
  min-height: 92px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-radius: 28px;
  background: #ffffff;
  border: 1px solid rgba(210, 210, 215, 0.72);
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.05);
}

.search-filter__switch-row + .search-filter__switch-row {
  margin-top: 14px;
}

.search-filter__switch-title {
  font-size: 34px;
  line-height: 1.16;
  font-weight: 600;
  color: #1d1d1f;
}

.search-filter__actions {
  display: flex;
  gap: 12px;
  margin-top: 18px;
}

.search-filter__action {
  flex: 1;
  min-height: 64px;
  border-radius: 999px;
  font-size: 30px;
  font-weight: 600;
}

.search-filter__action--ghost {
  border: 1px solid rgba(0, 113, 227, 0.24);
  background: #ffffff;
  color: #0066cc;
}

.search-filter__action--primary {
  border: none;
  background: #0071e3;
  color: #ffffff;
}

:deep(.van-switch--on) {
  background: #0071e3;
}

@media (max-width: 375px) {
  .search-filter {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
