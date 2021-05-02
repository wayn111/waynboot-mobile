import request from '@/utils/request'

export function addComment(data) {
  return request({
    url: '/comment',
    method: 'post',
    data
  })
}

export function getCommentList(data) {
  return request.formDataPost('/comment/list', data)
}

export function getCommentTagNum(data) {
  return request.formDataPost('/comment/tagNum', data)
}
