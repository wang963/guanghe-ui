import request from '@/utils/request'

// 查询告警信息列表
export function listAlerts(query) {
  return request({
    url: '/fanmonitor/alerts/list',
    method: 'get',
    params: query
  })
}

// 查询告警信息详细
export function getAlerts(id) {
  return request({
    url: '/fanmonitor/alerts/' + id,
    method: 'get'
  })
}

// 新增告警信息
export function addAlerts(data) {
  return request({
    url: '/fanmonitor/alerts',
    method: 'post',
    data: data
  })
}

// 修改告警信息
export function updateAlerts(data) {
  return request({
    url: '/fanmonitor/alerts',
    method: 'put',
    data: data
  })
}

// 删除告警信息
export function delAlerts(id) {
  return request({
    url: '/fanmonitor/alerts/' + id,
    method: 'delete'
  })
}

//获取告警信息
export function listObjects(query){
  return request({
    url:'/fanmonitor/alertObjects/list',
    method: 'get',
    params: query
  })
}
