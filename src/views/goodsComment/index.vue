<template>
  <div class="goods-comment">
    <nav-bar :title="$route.meta.title">
      <span style="color: #333">
        <svg-icon icon-class="share" :width="15" :height="15" />
      </span>
    </nav-bar>

    <van-form @submit="onSubmit">
      <van-field
        label="商品评价"
        :rules="[{ validator: rateValidator, message: '请选择商品评价' }]"
      >
        <template #input>
          <van-rate v-model="star" />
        </template>
      </van-field>

      <van-field
        v-model="content"
        :rules="[{ required: true, message: '请输入评价内容' }]"
        rows="2"
        autosize
        type="textarea"
        maxlength="140"
        placeholder="写出您的感受，帮助更多小伙伴！"
        show-word-limit
      />

      <van-field name="uploader">
        <template #input>
          <van-uploader
            v-model="uploader"
            multiple
            :max-count="9"
            :after-read="afterRead"
            preview-size="6.9rem"
          />
        </template>
      </van-field>

      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { closeToast, showDialog, showLoadingToast, showToast } from 'vant'

import { addComment } from '@/api/comment'
import { base64uploadFileList } from '@/api/upload'

const router = useRouter()

const props = defineProps({
  orderGoodsId: {
    type: [String, Number],
    default: 0,
  },
  goodsId: {
    type: [String, Number],
    default: 0,
  },
})

const state = reactive({
  star: 0,
  content: '',
  uploader: [],
  picUrls: [],
})

const { star, content, uploader, picUrls } = toRefs(state)

const afterRead = async (file) => {
  showLoadingToast({
    message: '正在上传...',
    forbidClick: true,
    overlay: true,
    duration: 0,
  })

  try {
    const fileArray = Array.isArray(file) ? file : [file]
    const payload = fileArray.map((item) => ({
      base64content: item.content,
      filename: item.file.name,
    }))

    const uploadRes = await base64uploadFileList(payload)
    const urlList = (uploadRes.data || []).map((item) => item.url)
    picUrls.value = [...picUrls.value, ...urlList]
    closeToast()
    showToast({
      type: 'success',
      message: '上传图片成功',
    })
  } catch (error) {
    closeToast()
    showToast({
      type: 'fail',
      message: error?.message || '上传图片失败',
    })
  }
}

const rateValidator = () => {
  return star.value > 0
}

const onSubmit = async () => {
  const param = {
    star: star.value,
    content: content.value,
    picUrls: picUrls.value,
    hasPicture: picUrls.value.length > 0,
    type: 0,
    valueId: props.goodsId,
    orderGoodsId: props.orderGoodsId,
    param: picUrls.value.length > 0,
  }

  await addComment(param)
  await showDialog({ message: '发布成功' })
  router.back()
}
</script>

<style lang="scss" scoped>
:deep(.van-uploader__wrapper) {
  justify-content: space-between;
}

:deep(.van-uploader__preview) {
  margin: 0 4px 8px 0;
}

:deep(.van-uploader__upload) {
  margin: 0 4px 8px 0;
}
</style>
