<template>
  <div class="comment">
    <nav-bar :title="$route.meta.title + '(' + totalNum + ')'" />
    <div class="tags">
      <van-tag
        v-for="(item, idx) in tags"
        :key="idx"
        class="tags__item"
        :color="variables.red"
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
          :imgs="item.picUrls"
          :goods-id="goodsId"
          style="margin-top: 12px"
        />
      </div>
    </van-list>
  </div>
</template>
<script>
import CommentItem from '@/components/CommentItem'
import variables from '@/styles/variables.scss'
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
  computed: {
    variables() {
      return variables
    }
  },
  created() {
    this.getCommentTagNum()
  },
  methods: {
    async getCommentTagNum() {
      const res = await getCommentTagNum({ goodsId: this.goodsId })
      const commentTagNum = res.map.commentTagNum
      this.totalNum = commentTagNum.totalNum
      this.tags = [
        `全部(${commentTagNum.totalNum})`,
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
      const { map: { page }} = res
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
@import '@/styles/variables.scss';

.comment {
  margin-top: 24px;
  background: #fff;
  .title {
    .comment__item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .comment__item__left {
        font-size: $small;
        .title {
          color: $black;
          margin-right: 16px;
        }
        .content {
          color: $red;
        }
      }
      .comment__item__right {
        display: flex;
        align-items: center;
        color: $gray;
        font-size: $mini;
      }
    }
    .comment__line {
      width: 700px;
      height: 1px;
      background: #f5f5f5;
      margin: 0 auto;
    }
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    padding: 12px 24px;
    .tags__item {
      margin: 0 24px 0 0;
      padding: 6px 12px;
      border-radius: 18px;
    }
  }
  .custom-num {
    margin-left: 8px;
    font-size: 5px;
    font-weight: 100;
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
