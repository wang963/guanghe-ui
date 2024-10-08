import request from '@/utils/request'

// 查询图片识别列表
export function listImages(query) {
  return request({
    url: '/fanmonitor/images/list',
    method: 'get',
    params: query
  })
}

// 查询图片识别详细
export function getImages(id) {
  return request({
    url: '/fanmonitor/images/' + id,
    method: 'get'
  })
}

// 新增图片识别
export function addImages(data) {
  return request({
    url: '/fanmonitor/images',
    method: 'post',
    data: data
  })
}

// 修改图片识别
export function updateImages(data) {
  return request({
    url: '/fanmonitor/images',
    method: 'put',
    data: data
  })
}

// 删除图片识别
export function delImages(id) {
  return request({
    url: '/fanmonitor/images/' + id,
    method: 'delete'
  })
}

// 检测图片
export function detectImg(ids, enhance_type){
  return request({
    url: 'fanmonitor/images/detection?ids=' + ids + '&enhance_type=' + enhance_type,
    method: 'get'
  })
}

// 增强图片
export function enhanceImg(ids, enhance_type){
  return request({
    url: 'fanmonitor/images/enhance?ids=' + ids + '&enhance_type=' + enhance_type,
    method: 'get'
  })
}
