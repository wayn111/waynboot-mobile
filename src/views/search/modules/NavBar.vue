<template>
  <div class="search-nav-bar">
    <van-icon
      class="back-icon"
      name="arrow-left"
      @click="$router.back()"
    />
    <van-search
      v-model="keyword"
      shape="round"
      class="search-input"
      :placeholder="defaultSearch"
      show-action
      clearable
      autofocus
      @focus="onFocus"
      @search="onSearch"
      @cancel="onCancel"
    >
      <template #action>
        <div @click="onSearch">搜索</div>
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

  .back-icon {
    font-size: 40px;
    padding: 24px 0 24px 24px;
  }

  .search-input {
    width: 100%;
  }
}
</style>
