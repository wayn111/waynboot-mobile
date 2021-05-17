<template>
  <div class="comment">
    <!-- <div class="title">
      <van-button block>
        <div class="comment__item">
          <div class="comment__item__left">
            <span class="title">评价</span>
            <span class="content">好评率{{ rate }}</span>
          </div>
          <div class="comment__item__right">
            <span class="text">共{{ num }}评论</span>
            <van-icon name="arrow" />
          </div>
        </div>
      </van-button>
      <div class="comment__line" />
    </div> -->
    <div class="item_cell_group">
      <van-cell
        :value="rate != 0 ? '好评率' + rate + '%' : ''"
        is-link
        :to="`/detail/comment/${goodsId}/0`"
      >
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <span>评论</span>
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
      >{{ item }}</van-tag>
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
        >查看全部评价</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import CommentItem from '@/components/CommentItem'
import variables from '@/styles/variables.scss'

export default {
  components: {
    CommentItem
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['rate', 'num', 'tags', 'list', 'goodsId'],
  computed: {
    variables() {
      return variables
    }
  },
  methods: {
    itemClick(tagType) {
      this.$router.push({
        path: `/detail/comment/${this.goodsId}/${tagType}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.comment {
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
      color: #ad0000;
      background-color: #ffe1e1;
      margin: 0 24px 0 0;
      padding: 10px 16px;
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
