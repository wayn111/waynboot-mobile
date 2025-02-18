import request from '@/utils/request'

export function getCaptcha() {
  return request({
    url: '/captcha',
    method: 'get'
  })
}

export function getMobileCode(data) {
  return request({
    url: '/genMobileCode',
    method: 'post',
    data,
    timeout: 5000
  })
}
