import request from '@/utils/request'

export function getGoodsList(data) {
  return request({
    url: '/home/goodsList',
    method: 'post',
    data
  })
}

export function getHomeData(data) {
  return request({
    url: '/home/index',
    method: 'post',
    data
  })
}
