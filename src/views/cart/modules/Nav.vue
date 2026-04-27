<template>
  <div>
    <nav-bar :title="$route.meta.title" :left-arrow="false" class="nav">
      <button type="button" class="nav__search" @click="onSearch">
        <van-icon name="search" size="20" />
      </button>
    </nav-bar>
    <div class="nav--placeholder" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

import NavBar from '@/components/NavBar'

const router = useRouter()

const onSearch = () => {
  router.push({
    path: '/search',
  })
}
</script>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
}

.nav__search {
  width: 52px;
  height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(245, 247, 251, 0.96);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
}

.nav__search :deep(.van-icon) {
  color: #1d1d1f;
}

.nav--placeholder {
  width: 100%;
  height: 96px;
}
</style>
