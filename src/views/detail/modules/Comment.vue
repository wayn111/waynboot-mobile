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
  background: #fff;

  .tags {
    display: flex;
    flex-wrap: wrap;
    padding: 12px 24px;

    .tags__item {
      color: #ad0000;
      background-color: #ffe1e1;
      margin: 0 24px 0 0;
      padding: 10px 16px;
      border-radius: 18px;
    }
  }

  .custom-num {
    margin-left: 8px;
    font-size: 24px;
    font-weight: 400;
    color: $gray;
  }

  .main {
    padding: 0 24px;

    .main__btn {
      display: flex;
      justify-content: center;
      padding: 24px;
    }
  }
}
</style>
