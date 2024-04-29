import request from '@/utils/request'

export function orderPrepay(data) {
  return request({
    url: '/pay/prepay',
    method: 'post',
    data
  })
}
