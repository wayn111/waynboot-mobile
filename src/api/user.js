import request from '@/utils/request'

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function profile(data) {
  return request({
    url: '/user/profile',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function setRegistry(data) {
  return request({
    url: '/registry',
    method: 'post',
    data
  })
}

export function updatePassword(data) {
  return request({
    url: '/user/updatePassword',
    method: 'post',
    data
  })
}

export function uploadAvatar(data) {
  return request.formDataPost('/user/uploadAvatar', data)
}

export function getMailCode(data) {
  return request({
    url: '/user/sendEmailCode',
    method: 'post',
    data,
    timeout: 20000
  })
}
