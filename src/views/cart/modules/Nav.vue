<template>
  <div>
    <nav-bar :title="$route.meta.title" class="nav">
      <van-icon name="search" size="20" @click="onSearch" />
    </nav-bar>
    <div class="nav--placeholder" />
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

import NavBar from '@/components/NavBar'

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
.nav--placeholder {
  width: 100%;
  height: 92px;
}
</style>
