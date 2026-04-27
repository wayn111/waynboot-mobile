<template>
  <div class="comment-item-component">
    <div class="title">
      <div class="title__left">
        <image-pic
          class="comment-avatar"
          round
          :src="avatar"
          width="56"
          height="56"
        />
        <div class="title__user">
          <span class="comment_name">{{ name }}</span>
          <van-rate
            :model-value="score"
            readonly
            :size="28"
            color="#0071e3"
            void-icon="star"
            void-color="#eee"
          />
        </div>
      </div>
      <div class="title__right">{{ time }}</div>
    </div>

    <div class="desc">
      <p class="desc__text van-multi-ellipsis--l3">{{ desc }}</p>
      <div class="desc_img">
        <image-pic
          v-for="(item, idx) in imgs"
          :key="idx"
          class="desc_img__pic"
          :src="item"
          fit="cover"
          width="132"
          height="132"
          @click="onClick(idx)"
        />
      </div>
      <div v-if="reply" class="admin-reply">
        <span>管理员回复：</span>{{ reply }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { showImagePreview } from 'vant'

const props = defineProps({
  avatar: {
    type: String,
    default: '',
  },
  time: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  score: {
    type: Number,
    default: 0,
  },
  desc: {
    type: String,
    default: '',
  },
  reply: {
    type: String,
    default: '',
  },
  imgs: {
    type: Array,
    default() {
      return []
    },
  },
})

const onClick = (index) => {
  showImagePreview({
    images: props.imgs,
    startPosition: index,
  })
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.comment-item-component {
  border-top: 1px solid rgba(29, 29, 31, 0.08);
  padding: 22px 0;

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 0 0 18px;

    .title__left {
      display: flex;
      align-items: center;
      gap: 10px;
      color: $black;
      font-size: 28px;
      min-width: 0;
    }

    .title__user {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .comment_name {
        max-width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 600;
      }
    }

    .title__right {
      flex: none;
      color: rgba(29, 29, 31, 0.48);
      font-size: 28px;
      line-height: 1.2;
    }
  }

  .desc {
    .desc__text {
      font-size: 28px;
      color: $black;
      line-height: 1.5;
      text-align: justify;
    }

    .desc_img {
      display: flex;
      flex-direction: row;
      gap: 12px;
      margin-top: 12px;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }

    .desc_img::-webkit-scrollbar {
      display: none;
    }

    .desc_img__pic {
      flex: none;
    }

    .admin-reply {
      padding: 16px;
      border-radius: 18px;
      background: #f5f5f7;
      font-size: 28px;
      margin-top: 18px;
      line-height: 1.45;

      span {
        color: #0066cc;
        font-weight: 600;
      }
    }
  }
}
</style>
