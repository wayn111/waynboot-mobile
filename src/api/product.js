import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/category/goods',
    method: 'get',
    params: data
  })
}
