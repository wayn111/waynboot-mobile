import request from '@/utils/request'

export function getAddress() {
  return request({
    url: '/address/list',
    method: 'get'
  })
}

export function addAddress(data) {
  return request({
    url: '/address',
    method: 'post',
    data
  })
}

export function updateAddress(data) {
  return request({
    url: '/address',
    method: 'put',
    data
  })
}
