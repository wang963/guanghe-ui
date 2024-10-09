import request from '@/utils/request'
export function commonGet(url,params) {
  return request({
    url,
    method: 'get',
    params
  })
}
export function commonPost(url,data) {
  return request({
    url,
    method: 'post',
    data
  })
}
