<template>
  <div class="comment-item-component">
    <div class="title">
      <div class="title__left">
        <image-pic
          round
          :src="avatar"
          width="25"
          height="25"
          style="margin-right: 6px"
        />
        <span class="comment_name">{{ name }}</span>
        <van-rate
          v-model="score"
          :size="15"
          :color="variables.red"
          void-icon="star"
          void-color="#eee"
        />
      </div>
      <div class="title__right">{{ time }}</div>
    </div>

    <div class="desc">
      <p class="desc__text van-multi-ellipsis--l3">{{ desc }}</p>
      <div class="desc_img">
        <image-pic
          v-for="(item, idx) in imgs"
          :key="idx"
          :src="item"
          fit="cover"
          width="90"
          height="90"
          style="margin-right: 8px"
          @click.native="onClick(idx)"
        />
      </div>
      <div v-if="reply" class="admin-reply">
        <span>管理员回复：</span>{{ reply }}
      </div>
    </div>
  </div>
</template>

<script>
import variables from '@/styles/variables.scss'
import { ImagePreview } from 'vant'

export default {
  props: {
    avatar: {
      type: String,
      default: ''
    },
    time: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    score: {
      type: Number,
      default: 0
    },
    desc: {
      type: String,
      default: ''
    },
    reply: {
      type: String,
      default: ''
    },
    imgs: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    variables() {
      return variables
    }
  },
  methods: {
    onClick(index) {
      ImagePreview(this.imgs, index)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.comment-item-component {
  border-top: 1px solid rgb(236, 231, 231);
  padding: 15px 0 10px 0;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 0 18px 0;
    .title__left {
      display: flex;
      align-items: center;
      color: $black;
      font-size: $small;
      .comment_name {
        margin: 0 10px 0 6px;
        max-width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .title__right {
      color: $gray;
      font-size: $small;
    }
  }
  .desc {
    .desc__text {
      font-size: $small;
      color: $black;
      line-height: 38px;
      text-align: justify;
    }
    .desc_img {
      display: flex;
      flex-direction: row;
      margin-top: 8px;
      overflow: scroll;
    }
    .admin-reply {
      font-size: $small;
      margin-top: 18px;
      line-height: 34px;
      span {
        color: #e26262;
      }
    }
  }
}
</style>
