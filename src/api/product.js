import request from '@/utils/request'

export function firstCategoryGoods(data) {
  return request({
    url: '/category/firstCategoryGoods',
    method: 'get',
    params: data
  })
}

export function secondCategoryGoods(data) {
  return request({
    url: '/category/secondCategoryGoods',
    params: data
  })
}
