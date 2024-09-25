import request from '@/utils/request'

// 查询拉流配置列表
export function listStream(query) {
  return request({
    url: '/fanmonitor/stream/list',
    method: 'get',
    params: query
  })
}

// 查询拉流配置详细
export function getStream(id) {
  return request({
    url: '/fanmonitor/stream/' + id,
    method: 'get'
  })
}

// 新增拉流配置
export function addStream(data) {
  return request({
    url: '/fanmonitor/stream',
    method: 'post',
    data: data
  })
}

// 修改拉流配置
export function updateStream(data) {
  return request({
    url: '/fanmonitor/stream',
    method: 'put',
    data: data
  })
}

// 删除拉流配置
export function delStream(id) {
  return request({
    url: '/fanmonitor/stream/' + id,
    method: 'delete'
  })
}
