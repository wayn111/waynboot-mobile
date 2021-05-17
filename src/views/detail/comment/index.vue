<template>
  <div class="comment">
    <nav-bar :title="$route.meta.title + '(' + totalNum + ')'" />
    <div class="tags">
      <van-tag
        v-for="(item, idx) in tags"
        :key="idx"
        class="tags__item"
        :plain="idx == type"
        @click="tagList(idx)"
      >{{ item }}</van-tag>
    </div>
    <van-list
      v-model="loading"
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
<script>
import CommentItem from '@/components/CommentItem'
import { getCommentList, getCommentTagNum } from '@/api/comment'

export default {
  components: {
    CommentItem
  },
  props: {
    goodsId: {
      type: String,
      default: ''
    },
    tagType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      finished: false,
      tags: [],
      list: [],
      type: 0,
      totalNum: '',
      pageSize: 10,
      pageNum: 1
    }
  },
  created() {
    this.type = this.tagType
    this.getCommentTagNum()
  },
  methods: {
    async getCommentTagNum() {
      const res = await getCommentTagNum({ goodsId: this.goodsId })
      const commentTagNum = res.map.commentTagNum
      this.totalNum = commentTagNum.totalNum
      this.tags = [
        `全部`,
        `好评(${commentTagNum.goodsNum})`,
        `中评(${commentTagNum.middleNum})`,
        `差评(${commentTagNum.badNum})`,
        `有图(${commentTagNum.hasPictureNum})`
      ]
    },
    async onLoad() {
      const res = await getCommentList({
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        tagType: this.type,
        goodsId: this.goodsId
      })
      const {
        map: { page }
      } = res
      this.list = [...this.list, ...page.records]
      this.loading = false
      // 数据全部加载完成
      if (page.records.length < this.pageSize) {
        this.finished = true
      }
      this.pageNum += 1
    },
    async tagList(tagType) {
      this.pageNum = 1
      this.type = tagType
      this.list = []
      this.loading = true
      this.onLoad()
    }
  }
}
</script>
<style lang="scss" scoped>

.comment {
  // margin-top: 24px;
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
