import request from '@/utils/request'

export function submit(data) {
  return request({
    url: '/order/submit',
    method: 'post',
    data
  })
}
