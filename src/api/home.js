import request from '@/utils/request'

export function getRecommonGoodsList(query) {
  return request({
    url: '/home/recommonGoodsList',
    method: 'get',
    params: query
  })
}

export function getHomeData(data) {
  return request({
    url: '/home/index',
    method: 'get',
    data
  })
}

export function getMallConfig(data) {
  return request({
    url: '/home/mallConfig',
    method: 'get',
    data
  })
}
