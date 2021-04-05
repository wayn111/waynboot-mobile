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

export function uploadAvatar(data) {
  return request.formDataPost('/user/uploadAvatar', data)
}

