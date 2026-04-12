<template>
  <div class="comment-page">
    <nav-bar :title="`${$route.meta.title}(${totalNum})`" />

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
          style="margin-top: 4px"
        />
      </div>
    </van-list>
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

  .main {
    padding: 0 24px;
  }
}
</style>
