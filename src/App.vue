<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <template v-if="Component">
        <keep-alive>
          <component :is="Component" :key="route.fullPath" v-if="route.meta.keepAlive" />
        </keep-alive>
        <component :is="Component" :key="route.fullPath" v-if="!route.meta.keepAlive" />
      </template>
    </router-view>

    <tabbar v-if="route.meta.showTab" />
  </div>
</template>

<script setup>
import Tabbar from './components/Tabbar/index.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const key = computed(() => {
      return route.fullPath
    })
</script>

<style scoped>
#app {
  position: relative;
}
</style>
