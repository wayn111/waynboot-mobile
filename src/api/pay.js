import request from '@/utils/request'

export function orderPrepay(data) {
  return request({
    url: '/pay/weixin/jsapi',
    method: 'post',
    data
  })
}
export function orderH5pay(data) {
  return request({
    url: '/pay/h5pay',
    method: 'post',
    data
  })
}
