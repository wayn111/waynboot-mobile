import request from '@/utils/request'

export function getRecommonGoodsList(query) {
  return request({
    url: '/home/recommonGoodsList',
    method: 'get',
    params: query
  })
}

export function getHomeData(params) {
  return request({
    url: '/home/index',
    method: 'get',
    params
  })
}

export function getMallConfig(params) {
  return request({
    url: '/home/mallConfig',
    method: 'get',
    params
  })
}
