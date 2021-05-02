<template>
  <div class="goodsComment">
    <nav-bar :title="$route.meta.title">
      <span style="color: #333">
        <svg-icon icon-class="share" :width="15" :height="15" />
      </span>
    </nav-bar>
    <van-form @submit="onSubmit">
      <van-field
        v-model="content"
        label="商品评价"
        :rules="[{ validator: rateValidator, message: '请选择商品评价' }]"
      >
        <template #input>
          <van-rate v-model="star" />
        </template>
      </van-field>
      <van-field
        v-model="content"
        :rules="[{ required: true }]"
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
        <van-button
          round
          block
          type="info"
          native-type="submit"
        >提交</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { base64uploadFileList } from '@/api/upload'
import { addComment } from '@/api/comment'

export default {
  props: {
    orderGoodsId: {
      type: [String, Number],
      default: 0
    },
    goodsId: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      star: 0,
      content: '',
      uploader: [],
      picUrls: []
    }
  },
  methods: {
    async afterRead(file) {
      this.$toast.loading({
        message: '正在上传...',
        forbidClick: true,
        overlay: true
      })
      if (!(file instanceof Array)) {
        file = [file]
      }
      const fileList = []
      file.forEach((item) => {
        fileList.push({
          base64content: item.content,
          filename: item.file.name
        })
      })
      // 此时可以自行将文件上传至服务器
      const uploadRes = await base64uploadFileList(fileList)
      const urlList = uploadRes.map.fileList.map((item) => {
        return item.url
      })
      this.picUrls = [...this.picUrls, ...urlList]
      console.log(this.picUrls)
      this.$toast.clear()
      this.$toast.success('上传图片成功')
    },
    rateValidator(val) {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.$toast.clear()
          resolve(val > 0)
        }, 200)
      })
    },
    onSubmit(values) {
      const param = {
        star: this.star,
        content: this.content,
        picUrls: this.picUrls,
        hasPicture: this.picUrls.length > 0,
        type: 0,
        valueId: this.goodsId,
        orderGoodsId: this.orderGoodsId
      }
      param.param = this.picUrls.length > 0
      addComment(param).then(() => {
        this.$dialog.alert({ message: '发布成功' }).then(() => {
          this.$router.go(-1)
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .van-uploader__wrapper {
  justify-content: space-between;
}
::v-deep .van-uploader__preview {
  margin: 0 4px 8px 0;
}
::v-deep .van-uploader__upload {
  margin: 0 4px 8px 0;
}
</style>
