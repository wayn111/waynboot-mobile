<template>
  <div class="popup_wrap">
    <van-icon name="clear" class="cancel_popup" @click="close" />
    <div class="popup_header">商品属性</div>
    <div class="popup_content">
      <van-cell-group>
        <van-cell v-for="(str, i) in propsStr" :key="i">
          <van-row>
            <van-col span="8">{{ str.attribute }}</van-col>
            <van-col span="16">{{ str.value }}</van-col>
          </van-row>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['closePopup'])
defineProps({
  propsStr: {
    type: Array,
    default() {
      return []
    }
  }
})

const close = () => {
  emit('closePopup')
}
</script>

<style lang="scss" scoped>
.popup_wrap {
  position: relative;
  padding: 28px 0 calc(30px + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;

  .popup_header {
    padding: 12px 0 28px;
    text-align: center;
    font-size: 36px;
    font-weight: 700;
    color: #1d1d1f;
  }

  .popup_content {
    min-height: 180px;
    max-height: 520px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0 24px;
    line-height: 1.45;

    :deep(.van-cell) {
      padding: 22px 0;
      background: transparent;
      font-size: 28px;
      color: #1d1d1f;
    }

    :deep(.van-cell::after) {
      border-color: rgba(29, 29, 31, 0.08);
    }

    :deep(.van-col:first-child) {
      color: rgba(29, 29, 31, 0.52);
      font-weight: 600;
    }

    &::-webkit-scrollbar {
      background-color: #fff;
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-color: #bebebe;
    }
    ol {
      padding-left: 24px;
      list-style: decimal;
    }
  }

  .cancel_popup {
    position: absolute;
    right: 24px;
    top: 24px;
    z-index: 9;
    font-size: 36px;
    color: rgba(29, 29, 31, 0.42);
  }
}
</style>
