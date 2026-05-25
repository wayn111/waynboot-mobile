import request from '@/utils/request'

export function orderCoupon(data) {
  return request({ url: '/coupon/list', method: 'get', params: data })
}

export function orderCouponMy(data) {
  return request({ url: '/coupon/myList', method: 'get', params: data })
}

export function orderReceive(data) {
  return request({ url: '/coupon/receive', method: 'post', data })
}
