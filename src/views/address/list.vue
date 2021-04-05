<template>
  <div class="address-list">
    <nav-bar :title="$route.meta.title" />

    <van-address-list
      v-model="defaultId"
      :list="list"
      default-tag-text="默认"
      @add="onAdd"
      @edit="onEdit"
      @select="onSelect"
    />

    <!-- 商品列表 -->
    <div class="goods">
      <div v-for="(item, idx) in exhibitionSettlementItemDTOs" :key="idx" class="goods--exhibition">
        <h3 class="exhibition__title">
          <svg-icon icon-class="store" :width="15" :height="15" />
          <span class="name">{{ item.exhibitionParkName }}</span>
        </h3>
        <div v-for="(settlementItem, idx2) in item.settlementItemDTOs" :key="idx2" class="goods__item">
          <img class="goods__item__img" :src="settlementItem.headPicture | addCDNImg">
          <div class="goods__item__main">
            <p class="goods__item__main__desc">{{ settlementItem.spuName }}</p>
            <p class="goods__item__main__attr">
              <span>{{ settlementItem.attribute1 }}</span>
              <span>{{ settlementItem.attribute2 }}</span>
            </p>
            <!-- <p class="goods__item__main__id">货号：{{item.supplierId}}</p> -->
          </div>
          <div class="goods__item__price">
            <span class="goods__item__price__price">¥{{ settlementItem.itemPrice | formatAmountFixed2Zero }}</span>
            <span class="goods__item__price__count">x{{ settlementItem.num }}</span>
          </div>
          <!-- new add: 运费 -->
          <div
            v-if="settlementItem.postage>0"
            class="goods__item__postage"
          >运费：¥{{ settlementItem.postage | formatAmountFixed2Zero }}</div>
        </div>
        <div class="exhibition__amount">
          <span
            v-if="role > 0"
            class="exhibition__amount__bouns"
          >返佣金¥{{ item.bonus | formatAmountFixed2Zero }}</span>
          <span>共1件商品 合计：¥{{ item.exhibitionTotalPrice | formatAmountFixed2Zero }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'

export default {
  name: 'Address',
  components: {
    NavBar
  },
  data() {
    return {
      defaultId: '',
      list: [],
      exhibitionSettlementItemDTOs: []
    }
  },
  async mounted() {
    this.$toast.loading('加载中...')
    this.list = await this.$store.dispatch('address/getList')
    this.list.forEach(item => {
      item.address = item.province + item.city + item.county + ' ' + item.addressDetail
    })
    this.$toast.clear()
  },
  methods: {
    onSelect(item, index) {
      this.$store.dispatch('address/setList', index)
      this.$router.go(-1)
    },
    onAdd() {
      this.$router.push({
        path: '/address/edit'
      })
    },
    onEdit(item, index) {
      this.$toast('编辑地址:' + index)
      this.$router.push({
        path: '/address/edit',
        query: {
          index
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.address-list {
  background: #f5f5f5;
  min-height: 100vh;
}
</style>
