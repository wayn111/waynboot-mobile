<template>
  <div class="card__item">
    <van-checkbox
      v-model="checked"
      icon-size="18px"
      :disabled="invalid"
      :checked-color="variables.theme"
      style="padding:0 10px 0 16px; background-color: white;"
    />
    <van-swipe-cell style="width:100%; background-color: white;" :before-close="beforeClose">
      <van-card :price="price" :desc="desc" :title="title" :thumb="thumb">
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
            v-if="!invalid"
            :value="num"
            :default-value="num"
            button-size="26px"
            min="1"
            :max="maxNumber"
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
      <div v-if="invalid" class="invalid">无货</div>
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
    maxNum: {
      type: Number,
      default: 0
    },
    isChecked: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
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
    },
    maxNumber() {
      return this.maxNum > this.num ? this.maxNum : this.num
    },
    invalid() {
      const valid = this.maxNum < this.num
      return valid
    }
  },
  watch: {
    num: {
      handler(n, o) {
        console.log('watch:' + n + ' ' + o)
      }
    },
    deep: true,
    immediate: true
  },
  mounted() {
    console.log('id:' + this.index + ' maxNum:' + this.maxNum + ' curNum:' + this.num)
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
          this.curNum = value
          this.$emit('changeNum', this.index, Number(value))
        })
        .catch()
    }
  }
}
</script>

<style lang="scss" scoped>
.card__item {
  position: relative;
  display: flex;
  flex-direction: row;
  background-color: #f9f8f8;
  padding: 0px 10px 15px 10px;
  .van-card__num {
    font-size: 16px;
  }
}
.van-card__footer {
  position: absolute;
  top: 150px;
  left: -16px;
}
.invalid {
  position: absolute;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
  border-radius: 50%;
  background-color: #554f4f;
  color: white;
  top: 40px;
  left: 60px;
  filter: opacity(80%);
}
</style>
