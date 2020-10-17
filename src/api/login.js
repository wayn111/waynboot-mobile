import request from '@/utils/request'

export function getCaptcha() {
  return request({
    url: '/captcha',
    method: 'get'
  })
}

export function getMailCode(data) {
  return request({
    url: '/home/index',
    method: 'post',
    data
  })
}
