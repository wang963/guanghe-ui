import request from '@/utils/request'

// 查询外发告警地址配置列表
export function listInfo(query) {
  return request({
    url: '/fanmonitor/info/list',
    method: 'get',
    params: query
  })
}

// 查询外发告警地址配置详细
export function getInfo(id) {
  return request({
    url: '/fanmonitor/info/' + id,
    method: 'get'
  })
}

// 新增外发告警地址配置
export function addInfo(data) {
  return request({
    url: '/fanmonitor/info',
    method: 'post',
    data: data
  })
}

// 修改外发告警地址配置
export function updateInfo(data) {
  return request({
    url: '/fanmonitor/info',
    method: 'put',
    data: data
  })
}

// 删除外发告警地址配置
export function delInfo(id) {
  return request({
    url: '/fanmonitor/info/' + id,
    method: 'delete'
  })
}
