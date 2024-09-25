import request from '@/utils/request'

// 查询异常告警列表
export function listAlarm(query) {
  return request({
    url: '/fanmonitor/alarm/list',
    method: 'get',
    params: query
  })
}

// 查询异常告警详细
export function getAlarm(id) {
  return request({
    url: '/fanmonitor/alarm/' + id,
    method: 'get'
  })
}

// 新增异常告警
export function addAlarm(data) {
  return request({
    url: '/fanmonitor/alarm',
    method: 'post',
    data: data
  })
}

// 修改异常告警
export function updateAlarm(data) {
  return request({
    url: '/fanmonitor/alarm',
    method: 'put',
    data: data
  })
}

// 删除异常告警
export function delAlarm(id) {
  return request({
    url: '/fanmonitor/alarm/' + id,
    method: 'delete'
  })
}
