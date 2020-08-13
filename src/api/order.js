import request from '@/utils/request'

export function submit(data) {
  return request({
    url: '/order/submit',
    method: 'post',
    data
  })
}

export function orderDetail(data) {
  return request({
    url: '/order/info',
    method: 'post',
    data
  })
}

export function orderPrepay(data) {
  return request({
    url: '/order/prepay',
    method: 'post',
    data
  })
}
export function orderH5pay(data) {
  return request({
    url: '/order/h5pay',
    method: 'post',
    data
  })
}
