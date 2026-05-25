import { createApp } from 'vue'

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

import setupVant from '@/components/Vant'
import setupWx from '@/components/Wx'
import setupFontAwesome from '@/components/fontAwesome'
import setupCommonComponents from '@/components/common'
import setupFilters from '@/filter'

const app = createApp(App)

app.use(router)
app.use(store)

setupVant(app)
setupWx(app)
setupFontAwesome(app)
setupCommonComponents(app)
setupFilters(app)

app.mount('#app')
