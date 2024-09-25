import request from '@/utils/request'

// 查询电站信息列表
export function listSite(query) {
  return request({
    url: '/windnacelle/site/list',
    method: 'get',
    params: query
  })
}

// 查询电站信息详细
export function getSite(siteId) {
  return request({
    url: '/windnacelle/site/' + siteId,
    method: 'get'
  })
}

// 新增电站信息
export function addSite(data) {
  return request({
    url: '/windnacelle/site',
    method: 'post',
    data: data
  })
}

// 修改电站信息
export function updateSite(data) {
  return request({
    url: '/windnacelle/site',
    method: 'put',
    data: data
  })
}

// 删除电站信息
export function delSite(siteId) {
  return request({
    url: '/windnacelle/site/' + siteId,
    method: 'delete'
  })
}
