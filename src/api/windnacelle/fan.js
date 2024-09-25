import request from '@/utils/request'

// 查询风机维护列表
export function listFan(query) {
  return request({
    url: '/windnacelle/fan/list',
    method: 'get',
    params: query
  })
}

// 查询风机线路列表
export function listLine(query) {
  return request({
    url: '/windnacelle/line/list',
    method: 'get',
    params: query
  })
}

export function listSite(query) {
  return request({
    url: '/windnacelle/site/list',
    method: 'get',
    params: query
  })
}
// 查询风机维护详细
export function getFan(fanId) {
  return request({
    url: '/windnacelle/fan/' + fanId,
    method: 'get'
  })
}

// 新增风机维护
export function addFan(data) {
  return request({
    url: '/windnacelle/fan',
    method: 'post',
    data: data
  })
}

// 修改风机维护
export function updateFan(data) {
  return request({
    url: '/windnacelle/fan',
    method: 'put',
    data: data
  })
}

// 删除风机维护
export function delFan(fanId) {
  return request({
    url: '/windnacelle/fan/' + fanId,
    method: 'delete'
  })
}
