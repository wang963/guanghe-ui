import request from '@/utils/request'

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
// 查询风机线路详细
export function getLine(lineId) {
  return request({
    url: '/windnacelle/line/' + lineId,
    method: 'get'
  })
}

// 新增风机线路
export function addLine(data) {
  return request({
    url: '/windnacelle/line',
    method: 'post',
    data: data
  })
}

// 修改风机线路
export function updateLine(data) {
  return request({
    url: '/windnacelle/line',
    method: 'put',
    data: data
  })
}

// 删除风机线路
export function delLine(lineId) {
  return request({
    url: '/windnacelle/line/' + lineId,
    method: 'delete'
  })
}
