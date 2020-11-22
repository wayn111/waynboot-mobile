import axios from 'axios'
import { Toast, Dialog } from 'vant'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建一个axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // withCredentials: true,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers.Authorization = getToken()
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    // 返回码不正确
    if (res.code !== 200) {
      Toast.fail(res.msg)
      // 现约定 50001:无效token 50002:token过期
      if (res.code === 50001 || res.code === 50002) {
        Dialog.alert({
          title: '提示',
          message: '您还未登录或登录已过期，请重新登录'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }

      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error)
    Toast.fail(error.message)
    return Promise.reject(error)
  }
)

export default service
