<template>
  <div>
    <div class="home-header">
      <button class="search" type="button" @click="onSearch">
        <span class="search__icon">
          <svg-icon icon-class="search" :width="20" :height="20" />
        </span>
        <span class="search__placeholder">搜索商品、分类、关键词</span>
        <span class="search__suffix">搜索</span>
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
  width: calc(100% - 32px);
  max-width: calc(var(--wb-content-width) - 32px);
  transform: translateX(-50%);
  z-index: 90;
  padding-top: calc(max(env(safe-area-inset-top, 0px), 0px) + 10px);

  .search {
    width: 100%;
    min-height: 68px;
    padding: 0 12px 0 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    border: none;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
    backdrop-filter: blur(18px);
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

  .search__suffix {
    flex: none;
    min-width: 106px;
    height: 46px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: linear-gradient(135deg, #2d7dff 0%, #1667f5 100%);
    color: #ffffff;
    font-size: 26px;
    font-weight: 600;
  }
}

.placeholder {
  width: 100%;
  height: 100px;
}
</style>
