<template>
  <div class="search-nav-bar">
    <button type="button" class="search-nav-bar__back" @click="$router.back()">
      <van-icon name="arrow-left" />
    </button>

    <van-search
      v-model="keyword"
      class="search-nav-bar__input"
      :placeholder="defaultSearch || '搜索商品、分类、关键词'"
      show-action
      clearable
      :autofocus="autofocus"
      @focus="onFocus"
      @search="onSearch"
      @cancel="onCancel"
    >
      <template #action>
        <button type="button" class="search-nav-bar__action" @click="onSearch">搜索</button>
      </template>
    </van-search>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { showToast } from 'vant'

const router = useRouter()
const store = useStore()

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  defaultSearch: {
    type: String,
    default: '',
  },
  autofocus: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'handleFocus', 'handleSearch'])

const keyword = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const onFocus = () => {
  emit('handleFocus')
}

const onSearch = () => {
  const key = keyword.value.trim() || props.defaultSearch.trim()
  if (!key) {
    showToast({
      type: 'fail',
      message: '请输入要搜索的内容',
    })
    return
  }
  store.dispatch('search/setKey', key)
  emit('handleSearch', key)
}

const onCancel = () => {
  keyword.value = ''
  router.back()
}
</script>

<style lang="scss" scoped>
.search-nav-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: var(--wb-content-width);
  margin: 0 auto;
  padding: calc(max(env(safe-area-inset-top, 0px), 0px) + 12px) 24px 16px;
}

.search-nav-bar__back {
  width: 52px;
  height: 52px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  appearance: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
  color: #1d1d1f;
}

.search-nav-bar__back :deep(.van-icon) {
  font-size: 32px;
}

.search-nav-bar__input {
  flex: 1;

  :deep(.van-search) {
    padding: 0;
    background: transparent;
  }

  :deep(.van-search__content) {
    min-height: 72px;
    padding-left: 8px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.94);
    box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
  }

  :deep(.van-search__field) {
    padding-left: 2px;
  }

  :deep(.van-field__control) {
    font-size: 30px;
    color: #1d1d1f;
  }

  :deep(.van-field__control::placeholder) {
    color: rgba(29, 29, 31, 0.38);
  }

  :deep(.van-field__left-icon),
  :deep(.van-icon-clear) {
    color: rgba(29, 29, 31, 0.48);
  }
}

.search-nav-bar__action {
  min-width: 116px;
  height: 50px;
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  appearance: none;
  border-radius: 999px;
  background: #1677ff;
  color: #ffffff;
  font-size: 28px;
  font-weight: 600;
}

@media (max-width: 375px) {
  .search-nav-bar {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
