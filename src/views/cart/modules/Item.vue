<template>
  <div class="card__item">
    <van-checkbox
      v-model="checked"
      icon-size="18px"
      :checked-color="variables.theme"
      style="padding:0 10px 0 16px"
    />
    <van-swipe-cell style="width:100%" :before-close="beforeClose">
      <van-card :tag="tag" :price="price" :desc="desc" :title="title" :thumb="thumb">
        <!-- <template #tags>
          <van-tag
            v-for="(item,idx) in tags"
            :key="idx"
            plain
            type="danger"
            style="margin-right:4px"
          >{{ item }}</van-tag>
        </template> -->
        <template #footer>
          <van-stepper
            :value="value"
            :default-value="value"
            theme="round"
            button-size="20"
            integer
            async-change
            @change="onChange"
          />
          <!-- <svg-icon icon-class="add-circle" :width="20" :height="20" @click="addNum"/>&nbsp;&nbsp;
          <svg-icon icon-class="minus-circle" :width="20" :height="20" @click="minusNum"/>-->
        </template>
      </van-card>
      <template #right>
        <van-button square text="删除" type="danger" style="height:100%" />
      </template>
    </van-swipe-cell>
  </div>
</template>

<script>
import variables from '@/styles/variables.scss'
import { changeNumber } from '@/api/cart'
export default {
  model: {
    prop: 'isChecked'
  },
  props: {
    index: {
      type: Number,
      default: 0
    },
    thumb: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    tag: {
      type: String,
      default: ''
    },
    tags: {
      type: Array,
      default() {
        return []
      }
    },
    originPrice: {
      type: Number,
      default: 0
    },
    price: {
      type: String,
      default: ''
    },
    num: {
      type: Number,
      default: 0
    },
    isChecked: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { value: this.num }
  },
  computed: {
    variables() {
      return variables
    },
    checked: {
      get() {
        return this.isChecked
      },
      set(val) {
        this.$emit('input', { val, idx: this.index })
      }
    }
  },
  methods: {
    // position 为关闭时点击的位置
    // instance 为对应的 SwipeCell 实例
    beforeClose({ position, instance }) {
      switch (position) {
        case 'cell':
        case 'outside':
          instance.close()
          break
        case 'right':
          this.$dialog
            .confirm({
              message: '确定删除吗？'
            })
            .then(() => {
              this.$emit('handleDelete', this.index)
              instance.close()
            })
            .catch(() => {
              instance.close()
            })
          break
      }
    },
    onChange(value) {
      if (!value) {
        return
      }
      // 防止重复调用接口
      if (value === this.value) {
        return
      }
      // 注意此时修改 value 后会再次触发 change 事件
      changeNumber(this.index, value)
        .then((res) => {
          this.value = value
          this.$emit('changeNum', this.index, Number(value))
        })
        .catch()
    }
  }
}
</script>

<style lang="scss" scoped>
.card__item {
  display: flex;
  flex-direction: row;
  margin-bottom: 14px;

  .van-card__num {
    font-size: 16px;
  }
}
</style>
