import request from '@/utils/request'

// 查询风机部件列表
export function listComponent(query) {
  return request({
    url: '/windnacelle/component/list',
    method: 'get',
    params: query
  })
}

// 查询风机维护列表
export function listFan(query) {
  return request({
    url: '/windnacelle/fan/list',
    method: 'get',
    params: query
  })
}

// 查询风机部件详细
export function getComponent(componentId) {
  return request({
    url: '/windnacelle/component/' + componentId,
    method: 'get'
  })
}

// 新增风机部件
export function addComponent(data) {
  return request({
    url: '/windnacelle/component',
    method: 'post',
    data: data
  })
}

// 修改风机部件
export function updateComponent(data) {
  return request({
    url: '/windnacelle/component',
    method: 'put',
    data: data
  })
}

// 删除风机部件
export function delComponent(componentId) {
  return request({
    url: '/windnacelle/component/' + componentId,
    method: 'delete'
  })
}
