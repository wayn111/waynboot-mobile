import request from '@/utils/request'

export function getCartList() {
  return request({
    url: '/cart/list',
    method: 'get'
  })
}

export function getCartGoodsCount() {
  return request({
    url: '/cart/goodsCount',
    method: 'get'
  })
}

export function addCart(data) {
  return request({
    url: '/cart/add',
    method: 'post',
    data
  })
}

export function deleteCart(cartId) {
  return request({
    url: '/cart/' + cartId,
    method: 'delete'
  })
}
