import ImagePic from './ImagePic/index.vue'
import BackTop from './BackTop/index.vue'
import NavBar from './NavBar/index.vue'
import SvgIcon from './SvgIcon/index.vue'
import VueScrollTo from 'vue-scrollto'

// 注册一些常用的组件到全局
export default function setupCommonComponents(app) {
  app.component('image-pic', ImagePic)
  app.component('back-top', BackTop)
  app.component('nav-bar', NavBar)
  app.component('svg-icon', SvgIcon)
  app.use(VueScrollTo, {
    container: 'body',
    duration: 500,
    easing: 'ease',
    offset: 0,
    force: true,
    cancelable: true,
    onStart: false,
    onDone: false,
    onCancel: false,
    x: false,
    y: true,
  })
}
