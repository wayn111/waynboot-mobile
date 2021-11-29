import axios from 'axios'
import qs from 'qs'
import { Toast, Dialog } from 'vant'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'

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
      // 5001订单不存在
      // if (res.code !== 5001) {
      //   Toast.fail(res.msg)
      // }
      // 401未登陆
      if (res.code === 401) {
        Dialog.alert({
          title: '提示',
          message: '您还未登录，请登录'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            router.push({ name: 'Login' })
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

/**
 * 使用 application/x-www-form-urlencoded format
 * @param {*} url
 * @param {*} postData
 * @returns
 */
service.formDataPost = function(url, postData) {
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(postData),
    url
  }
  return service(options)
}

export default service
