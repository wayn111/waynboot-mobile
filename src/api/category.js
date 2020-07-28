import request from '@/utils/request'

export function getCategoryData() {
  return request({
    url: '/category/index',
    method: 'get'
  })
}
export function getCategoryContent(data) {
  return request({
    url: '/category/content',
    method: 'post',
    data
  })
}
