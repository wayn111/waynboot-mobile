<template>
  <div class="comment-page wb-page">
    <nav-bar :title="`${$route.meta.title}(${totalNum})`" />

    <div class="comment-page__body">
      <section class="comment-page__summary">
        <span>全部评价</span>
        <strong>{{ totalNum }}</strong>
      </section>

      <div class="tags">
        <van-tag
          v-for="(item, idx) in tags"
          :key="idx"
          class="tags__item"
          :plain="idx === type"
          @click="tagList(idx)"
        >
          {{ item }}
        </van-tag>
      </div>

      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
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
            :goods-id="goodsId"
            style="margin-top: 12px"
          />
        </div>
      </van-list>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, toRefs } from 'vue'

import CommentItem from '@/components/CommentItem'
import { getCommentList, getCommentTagNum } from '@/api/comment'

const props = defineProps({
  goodsId: {
    type: String,
    default: '',
  },
  tagType: {
    type: [String, Number],
    default: 0,
  },
})

const state = reactive({
  loading: false,
  finished: false,
  tags: [],
  list: [],
  type: Number(props.tagType || 0),
  totalNum: 0,
  pageSize: 10,
  pageNum: 1,
})

const { loading, finished, tags, list, type, totalNum, pageSize, pageNum } = toRefs(state)

const fetchCommentTagNum = async () => {
  const res = await getCommentTagNum({ goodsId: props.goodsId })
  const commentTagNum = res.data || {}
  totalNum.value = commentTagNum.totalNum || 0
  tags.value = [
    '全部',
    `好评(${commentTagNum.goodsNum || 0})`,
    `中评(${commentTagNum.middleNum || 0})`,
    `差评(${commentTagNum.badNum || 0})`,
    `有图(${commentTagNum.hasPictureNum || 0})`,
  ]
}

const onLoad = async () => {
  try {
    const res = await getCommentList({
      pageSize: pageSize.value,
      pageNum: pageNum.value,
      tagType: type.value,
      goodsId: props.goodsId,
    })
    const records = res.data?.records || []
    list.value = [...list.value, ...records]
    finished.value = records.length < pageSize.value
    pageNum.value += 1
  } finally {
    loading.value = false
  }
}

const tagList = (tagType) => {
  pageNum.value = 1
  type.value = tagType
  list.value = []
  finished.value = false
  loading.value = true
  onLoad()
}

onMounted(() => {
  fetchCommentTagNum()
})
</script>

<style lang="scss" scoped>
.comment-page {
  min-height: 100vh;
  overflow-x: hidden;
  background: linear-gradient(180deg, #f5f5f7 0%, #ffffff 48%, #f5f5f7 100%);

  .comment-page__body {
    width: 100%;
    max-width: var(--wb-content-width);
    margin: 0 auto;
    padding: 18px 18px 40px;
  }

  .comment-page__summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
    padding: 24px;
    border-radius: 30px;
    background: #ffffff;
    box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);

    span {
      font-size: 30px;
      line-height: 1.2;
      color: rgba(29, 29, 31, 0.56);
      font-weight: 600;
    }

    strong {
      font-size: 46px;
      line-height: 1;
      color: #1d1d1f;
      font-weight: 700;
    }
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 18px;
    padding: 24px;
    border-radius: 30px;
    background: #ffffff;
    box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);

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

  .main {
    padding: 0 24px;
    border-radius: 30px;
    background: #ffffff;
    box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
  }

  :deep(.van-list__finished-text),
  :deep(.van-list__loading) {
    font-size: 28px;
  }

  @media (max-width: 375px) {
    .comment-page__body {
      padding-right: 16px;
      padding-left: 16px;
    }
  }
}
</style>
