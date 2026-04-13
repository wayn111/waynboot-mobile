import { createApp } from 'vue'

// A modern alternative to CSS resets
// https://github.com/necolas/normalize.css
import 'normalize.css/normalize.css'
import 'vant/lib/index.css'
import './utils/flexible'
import './styles/index.scss'
import './assets/iconfont/iconfont.css'
import 'virtual:svg-icons-register'

import App from './App.vue'
import router from './router'
import store from './store'

import './permission'

// import vant
import setupVant from '@/components/Vant'
import setupWx from '@/components/Wx'
// import fontAwesome
import setupFontAwesome from '@/components/fontAwesome'
// register common components globally
import setupCommonComponents from '@/components/common'
import setupFilters from '@/filter'
// 引入fastclick
// import FastClick from 'fastclick'

// FastClick.attach(document.body)

const app = createApp(App)

app.use(router)
app.use(store)

setupVant(app)
setupWx(app)
setupFontAwesome(app)
setupCommonComponents(app)
setupFilters(app)

// mock in online
if (import.meta.env.MODE === 'production') {
  // const { mockXHR } = require('../mock')
  // mockXHR()
}

app.mount('#app')
