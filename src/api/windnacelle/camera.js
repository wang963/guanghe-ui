import request from '@/utils/request'

// 查询视频维护列表
export function listCamera(query) {
  return request({
    url: '/windnacelle/camera/list',
    method: 'get',
    params: query
  })
}

export function listFan(query) {
  return request({
    url: '/windnacelle/fan/list',
    method: 'get',
    params: query
  })
}
// 查询视频维护详细
export function getCamera(cameraId) {
  return request({
    url: '/windnacelle/camera/' + cameraId,
    method: 'get'
  })
}

// 新增视频维护
export function addCamera(data) {
  return request({
    url: '/windnacelle/camera',
    method: 'post',
    data: data
  })
}

// 修改视频维护
export function updateCamera(data) {
  return request({
    url: '/windnacelle/camera',
    method: 'put',
    data: data
  })
}

// 删除视频维护
export function delCamera(cameraId) {
  return request({
    url: '/windnacelle/camera/' + cameraId,
    method: 'delete'
  })
}
