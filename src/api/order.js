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

export function orderDetail(orderSn) {
  return request({
    url: `/order/detail/${orderSn}`,
    method: 'get'
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

export function orderCoupon(data) {
  return request({
    url: `/coupon/list`,
    method: 'get',
    params: data
  })
}

export function orderCouponMy(data) {
  return request({
    url: `/coupon/myList`,
    method: 'get',
    params: data
  })
}

export function orderReceive(data) {
  return request({
    url: '/coupon/receive',
    method: 'post',
    data
  })
}
