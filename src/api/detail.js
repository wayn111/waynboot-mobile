import request from '@/utils/request'

export function getDetail(goodsId) {
  return request({
    url: `/goods/detail/${goodsId}`,
    method: 'get'
  })
}
