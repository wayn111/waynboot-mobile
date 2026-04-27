<template>
  <div class="comment">
    <div class="item_cell_group">
      <van-cell
        :value="rate !== 0 ? `好评率 ${rate}%` : ''"
        is-link
        :to="`/detail/comment/${goodsId}/0`"
      >
        <template #title>
          <span>评价</span>
          <span class="custom-num">{{ num }}</span>
        </template>
      </van-cell>
    </div>

    <div class="tags">
      <van-tag
        v-for="(item, idx) in tags"
        :key="idx"
        class="tags__item"
        @click="itemClick(idx)"
      >
        {{ item }}
      </van-tag>
    </div>

    <div class="main">
      <comment-item
        v-for="(item, idx) in list"
        :key="idx"
        :avatar="item.avatar"
        :name="item.username"
        :time="item.createTime"
        :score="item.star"
        :desc="item.content"
        :reply="item.adminContent"
        :imgs="item.picUrls"
        style="margin-top: 4px"
      />

      <div class="main__btn">
        <van-button
          :color="variables.gray"
          plain
          round
          size="small"
          @click="itemClick(0)"
        >
          查看全部评价
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

import CommentItem from '@/components/CommentItem'
import variables from '@/styles/variables.scss?inline'

const router = useRouter()

const props = defineProps({
  rate: {
    type: Number,
    default: 0,
  },
  num: {
    type: String,
    default: '',
  },
  tags: {
    type: Array,
    default() {
      return []
    },
  },
  list: {
    type: Array,
    default() {
      return []
    },
  },
  goodsId: {
    type: String,
    default: '',
  },
})

const itemClick = (tagType) => {
  router.push({
    path: `/detail/comment/${props.goodsId}/${tagType}`,
  })
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.comment {
  margin-top: 16px;
  overflow: hidden;
  border-radius: 32px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);

  :deep(.van-cell) {
    align-items: center;
    padding: 26px 24px;
    background: transparent;
  }

  :deep(.van-cell::after) {
    right: 24px;
    left: 24px;
    border-color: rgba(29, 29, 31, 0.08);
  }

  :deep(.van-cell__title) {
    color: #1d1d1f;
    font-size: 32px;
    line-height: 1.2;
    font-weight: 700;
  }

  :deep(.van-cell__value) {
    color: #0066cc;
    font-size: 28px;
    line-height: 1.25;
    font-weight: 600;
  }

  :deep(.van-cell__right-icon) {
    color: rgba(29, 29, 31, 0.34);
    font-size: 32px;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 0 24px 14px;

    .tags__item {
      color: #0066cc;
      background-color: rgba(0, 113, 227, 0.08);
      margin: 0;
      padding: 10px 18px;
      border-radius: 999px;
      font-size: 28px;
      line-height: 1.2;
      font-weight: 600;
    }
  }

  .custom-num {
    margin-left: 8px;
    font-size: 28px;
    font-weight: 600;
    color: rgba(29, 29, 31, 0.48);
  }

  .main {
    padding: 0 24px 18px;

    .main__btn {
      display: flex;
      justify-content: center;
      padding: 24px 0 4px;

      :deep(.van-button) {
        height: 56px;
        padding: 0 24px;
        border-color: rgba(0, 102, 204, 0.22);
        color: #0066cc !important;
        font-size: 28px;
        font-weight: 600;
      }
    }
  }
}
</style>
