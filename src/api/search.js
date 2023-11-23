import request from '@/utils/request'

export function getHotList() {
  return request({
    url: '/search/hotKeywords',
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

export function getSearchSuggest(data) {
  return request({
    url: '/search/sugguest',
    method: 'get',
    params: data
  })
}
