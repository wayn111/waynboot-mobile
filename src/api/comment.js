import request from '@/utils/request'

export function getCommentList(data) {
  return request.formDataPost('/comment/list', data)
}

export function getCommentTagNum(data) {
  return request.formDataPost('/comment/tagNum', data)
}
