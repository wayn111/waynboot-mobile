<template>
  <section class="home-kongo">
    <div class="home-kongo__head">
      <h2 class="home-kongo__title">分类</h2>
      <button type="button" class="home-kongo__link" @click="goAllCategory">
        全部
        <van-icon name="arrow" />
      </button>
    </div>

    <div class="home-kongo__grid">
      <button
        v-for="(item, index) in visibleList"
        :key="item.id"
        type="button"
        class="home-kongo__item"
        @click="onNavigate(item)"
      >
        <span class="home-kongo__thumb" :class="`home-kongo__thumb--${index % 5}`">
          <img :src="item.iconUrl" :alt="item.name" />
        </span>
        <span class="home-kongo__name">{{ item.name }}</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  diamondList: {
    type: Array,
    default: () => [],
  },
})

const visibleList = computed(() => {
  return props.diamondList.slice(0, 10)
})

const onNavigate = (item) => {
  if (item.jumpType === 2) {
    return
  }

  router.push({
    path: `/diamondGoodsList/${item.id}`,
  })
}

const goAllCategory = () => {
  router.push({ path: '/category' })
}
</script>

<style lang="scss" scoped>
.home-kongo {
  padding: 0 4px;
}

.home-kongo__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
  padding: 0 4px;
}

.home-kongo__title {
  font-size: 34px;
  line-height: 1.08;
  font-weight: 700;
  color: #1d1d1f;
  letter-spacing: -0.2px;
}

.home-kongo__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: none;
  background: transparent;
  color: rgba(29, 29, 31, 0.42);
  font-size: 26px;
  font-weight: 500;
  cursor: pointer;
}

.home-kongo__grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 18px 10px;
}

.home-kongo__item {
  padding: 0;
  border: 0;
  background: transparent;
  text-align: center;
  cursor: pointer;
}

.home-kongo__thumb {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.05);
}

.home-kongo__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.home-kongo__thumb--0 {
  background: linear-gradient(135deg, #ffe8cf 0%, #ffd7ab 100%);
}

.home-kongo__thumb--1 {
  background: linear-gradient(135deg, #dbeafe 0%, #c7d2fe 100%);
}

.home-kongo__thumb--2 {
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
}

.home-kongo__thumb--3 {
  background: linear-gradient(135deg, #cfeaff 0%, #a7d7ff 100%);
}

.home-kongo__thumb--4 {
  background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
}

.home-kongo__name {
  display: block;
  margin-top: 12px;
  font-size: 24px;
  line-height: 1.25;
  font-weight: 500;
  color: #1d1d1f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 375px) {
  .home-kongo__grid {
    gap: 16px 8px;
  }

  .home-kongo__thumb {
    border-radius: 20px;
  }
}
</style>
