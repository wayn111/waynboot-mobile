<template>
  <div class="classification">
    <img src="./../../../assets/images/icon15.png" class="topImg">
    <div class="centerContent">
      <div v-for="item in list" :key="item.id" class="listImg">
        <img :src="item.imgUrl" class="listImgOne" @click="onNavigate(item)">
        <!-- <img :src="item.bottom" class="listImgTwo"/> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
    //   list:[
    //     {icon:require('./../../../assets/images/icon16.png'),bottom:require('./../../../assets/images/icon22.png')},
    //     {icon:require('./../../../assets/images/icon17.png'),bottom:require('./../../../assets/images/icon23.png')},
    //     {icon:require('./../../../assets/images/icon18.jpg'),bottom:require('./../../../assets/images/icon24.png')},
    //     {icon:require('./../../../assets/images/icon19.png'),bottom:require('./../../../assets/images/icon25.png')},
    //     {icon:require('./../../../assets/images/icon20.png'),bottom:require('./../../../assets/images/icon26.png')},
    //     {icon:require('./../../../assets/images/icon21.jpg'),bottom:require('./../../../assets/images/icon27.png')},
    //   ]
    }
  },
  methods: {
    // 跳转
    onNavigate(item) {
      window.location.href = item.jumpUrl
    }

  }
}
</script>
<style lang="scss" scoped>
.classification{
    background-color: #fff;
    .topImg{
        width: 100%;
    }
    .centerContent{
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-wrap: wrap;
        padding:0 20px;
        .listImg{
            width:30%;
            img{
                width:100%;
            }
        }
    }
}
</style>
