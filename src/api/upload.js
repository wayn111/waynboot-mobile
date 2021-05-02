import request from '@/utils/request'

const uploadPath = process.env.VUE_APP_BASE_API + '/common/upload'
export { uploadPath }

export function fileUpload(data) {
  return request({
    url: '/common/upload',
    method: 'post',
    data
  })
}

export function base64uploadFile(data) {
  return request.formDataPost('/common/base64uploadFile', data)
}

export function base64uploadFileList(data) {
  return request({
    url: '/common/base64uploadFileList',
    method: 'post',
    data
  })
}
