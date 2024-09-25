import request from '@/utils/request'

// 查询人员分组管理列表
export function listGroup(query) {
  return request({
    url: '/fanmonitor/group/list',
    method: 'get',
    params: query
  })
}

// 查询人员分组管理详细
export function getGroup(id) {
  return request({
    url: '/fanmonitor/group/' + id,
    method: 'get'
  })
}

// 新增人员分组管理
export function addGroup(data) {
  return request({
    url: '/fanmonitor/group',
    method: 'post',
    data: data
  })
}

// 修改人员分组管理
export function updateGroup(data) {
  return request({
    url: '/fanmonitor/group',
    method: 'put',
    data: data
  })
}

// 删除人员分组管理
export function delGroup(id) {
  return request({
    url: '/fanmonitor/group/' + id,
    method: 'delete'
  })
}
