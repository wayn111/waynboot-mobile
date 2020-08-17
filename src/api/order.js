import request from '@/utils/request'

export function submit(data) {
  return request({
    url: '/order/submit',
    method: 'post',
    data
  })
}

export function statusCount() {
  return request({
    url: '/order/statusCount',
    method: 'post'
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

export function orderList(data) {
  return request({
    url: '/order/list',
    method: 'get',
    params: data
  })
}
