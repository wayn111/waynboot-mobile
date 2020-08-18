import request from '@/utils/request'

export function getCategoryData() {
  return request({
    url: '/category/index',
    method: 'get'
  })
}

export function getCategoryContent(query) {
  return request({
    url: '/category/content',
    method: 'get',
    params: query
  })
}
