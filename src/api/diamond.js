import request from '@/utils/request'

export function getGoodsList(query) {
  return request({
    url: '/diamond/getGoodsList',
    method: 'get',
    params: query
  })
}
