<template>
  <div>
    <div class="home-header">
      <button class="search" type="button" @click="onSearch">
        <span class="search__icon">
          <svg-icon icon-class="search" :width="20" :height="20" />
        </span>
        <span class="search__placeholder">搜索商品、分类、关键词</span>
        <span class="search__divider" />
        <span class="search__action">搜索</span>
      </button>
    </div>
    <div class="placeholder" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const onSearch = () => {
  router.push({
    path: '/search',
  })
}
</script>

<style lang="scss" scoped>
.home-header {
  position: fixed;
  top: 0;
  left: 50%;
  width: 100%;
  max-width: var(--wb-content-width);
  transform: translateX(-50%);
  z-index: 90;
  padding: calc(max(env(safe-area-inset-top, 0px), 0px) + 14px) 18px 14px;
  background: rgba(245, 245, 247, 0.86);
  backdrop-filter: saturate(180%) blur(18px);
  -webkit-backdrop-filter: saturate(180%) blur(18px);

  .search {
    width: 100%;
    min-height: 72px;
    padding: 0 20px 0 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    border: none;
    border-radius: 999px;
    background: #ffffff;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
    text-align: left;
    color: #1d1d1f;
  }

  .search__icon {
    flex: none;
    color: rgba(29, 29, 31, 0.42);
  }

  .search__placeholder {
    flex: 1;
    min-width: 0;
    font-size: 28px;
    line-height: 1.25;
    color: rgba(29, 29, 31, 0.42);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .search__divider {
    width: 1px;
    height: 24px;
    flex: none;
    background: rgba(29, 29, 31, 0.08);
  }

  .search__action {
    flex: none;
    color: #0071e3;
    font-size: 28px;
    font-weight: 600;
  }
}

.placeholder {
  width: 100%;
  height: 100px;
}
</style>
