<template>
  <div class="section">
    <div class="item_cell_group">
      <van-cell-group>
        <van-cell
          title="规格"
          is-link
          :value="name + ' ' + stockNum + ' 个'"
          @click.native="onSelectSku"
        />
        <van-cell title="属性" is-link @click.native="propsPopup = true" />
        <van-cell
          title="送至"
          is-link
          :value="selectedAddress.address || '选择收货地址'"
          @click="handleAddress"
        />
        <van-cell title="运费" value="88元" />
      </van-cell-group>
    </div>
    <!-- <van-button block @click="onSelectSku">
      <div class="section__item">
        <div class="section__item__left">
          <span class="title">已选</span>
          <span class="content">{{ name }}，{{ stockNum }}个</span>
        </div>
        <div class="section__item__right">
          <van-icon name="arrow" />
        </div>
      </div>
    </van-button>

    <div class="section__line" />
    <van-button block @click.native="propsPopup = true">
      <div class="section__item">
        <div class="section__item__left">
          <span class="content">属性</span>
        </div>
        <div class="section__item__right">
          <van-icon name="arrow" />
        </div>
      </div>
    </van-button>

    <div class="section__line" />
    <van-button block @click="handleAddress">
      <div class="section__item">
        <div class="section__item__left">
          <span class="title">送至</span>
          <span class="content">{{
            selectedAddress.address || "北京市 东城区"
          }}</span>
        </div>
        <div class="section__item__right">
          <van-icon name="arrow" />
        </div>
      </div>
    </van-button>

    <div class="section__line" />
    <van-button block>
      <div class="section__item section__item--icon">
        <div class="section__item__left">
          <p
            v-for="(item, idx) in ['panda自营', 'panda发货', '七天无理由退款']"
            :key="idx"
            class="icon--wrapper"
          >
            <svg-icon icon-class="good" :width="16" :height="16" />
            <span>{{ item }}</span>
          </p>
        </div>
        <div class="section__item__right">
          <van-icon name="arrow" />
        </div>
      </div>
    </van-button> -->
    <van-popup v-if="isShowAttr" v-model="propsPopup" position="bottom">
      <popup-props :props-str="attr" @closePopup="closePopup" />
    </van-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PopupProps from './Popup-props'

export default {
  components: {
    PopupProps
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    stockNum: {
      type: Number,
      default: 4
    },
    attr: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      propsPopup: false,
      isShowAttr: false
    }
  },
  computed: {
    ...mapGetters(['selectedAddress'])
  },
  watch: {
    attr(o1, o2) {
      this.attr = o1
      this.isShowAttr = true
    }
  },
  mounted() {},
  methods: {
    onSelectSku() {
      this.$emit('input', true)
    },
    handleAddress() {
      this.$router.push({
        path: '/address'
      })
    },
    closePopup() {
      this.propsPopup = false
    }
  }
}
</script>

<style lang="scss">
.section {
  .van-button--default {
    border: none;
    border-radius: 0px;
  }
}
</style>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.section {
  //  width:700px;
  //  margin: 0 auto;
  // border-radius: 6px;
  margin-top: 24px;
  background: #fff;
  .van-cell__value {
    min-width: 80%;
  }
  /* .section__item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .section__item__left {
      font-size: $small;
      .title {
        color: $gray;
        margin-right: 16px;
      }
      .content {
        color: $black;
      }
    }
    .section__item__right {
      color: $gray;
    }
  }
  .section__item--icon {
    .section__item__left {
      display: flex;
      .icon--wrapper {
        display: flex;
        align-items: center;
        color: $gray;
        font-size: $small;
        margin-right: 10px;
        span {
          margin-left: 6px;
        }
      }
    }
  }
  .section__line {
    width: 700px;
    height: 1px;
    background: #f5f5f5;
    margin: 0 auto;
  } */
}
</style>
