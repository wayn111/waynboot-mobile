import request from '@/utils/request'

export function getHotList() {
  return request({
    url: '/search/hotList',
    method: 'get'
  })
}

export function getSearchList(data) {
  return request({
    url: '/search/result',
    method: 'get',
    params: data
  })
}
