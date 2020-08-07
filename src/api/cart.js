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
    url: '/cart',
    method: 'post',
    data
  })
}

export function updateCart(data) {
  return request({
    url: '/cart',
    method: 'put',
    data
  })
}

export function addNumber(cartId, number) {
  return request({
    url: `/cart/addNum/${cartId}/${number}`,
    method: 'post'
  })
}

export function minusNumber(cartId, number) {
  return request({
    url: `/cart/minusNum/${cartId}/${number}`,
    method: 'post'
  })
}

export function deleteCart(cartId) {
  return request({
    url: '/cart/' + cartId,
    method: 'delete'
  })
}
