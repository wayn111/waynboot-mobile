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

export function searchResult(orderId) {
  return request({
    url: '/order/searchResult/' + orderId + '?t=' + new Date().getTime(),
    method: 'get'
  })
}

export function orderList(data) {
  return request({
    url: '/order/list',
    method: 'get',
    params: data
  })
}

export function orderCancel(orderId) {
  return request({
    url: '/order/cancel/' + orderId,
    method: 'post'
  })
}

export function orderRefund(orderId) {
  return request({
    url: '/order/refund/' + orderId,
    method: 'post'
  })
}

export function orderDelete(orderId) {
  return request({
    url: '/order/delete/' + orderId,
    method: 'post'
  })
}

export function orderConfirm(orderId) {
  return request({
    url: '/order/confirm/' + orderId,
    method: 'post'
  })
}
