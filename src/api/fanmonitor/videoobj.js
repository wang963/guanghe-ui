import request from '@/utils/request'

// 查询监控视频检测列表
export function listVideoobj(query) {
  return request({
    url: '/fanmonitor/videoobj/list',
    method: 'get',
    params: query
  })
}

// 查询监控视频检测详细
export function getVideoobj(id) {
  return request({
    url: '/fanmonitor/videoobj/' + id,
    method: 'get'
  })
}

// 新增监控视频检测
export function addVideoobj(data) {
  return request({
    url: '/fanmonitor/videoobj',
    method: 'post',
    data: data
  })
}

// 修改监控视频检测
export function updateVideoobj(data) {
  return request({
    url: '/fanmonitor/videoobj',
    method: 'put',
    data: data
  })
}

// 删除监控视频检测
export function delVideoobj(id) {
  return request({
    url: '/fanmonitor/videoobj/' + id,
    method: 'delete'
  })
}

// 查询视频维护列表
export function getCameras(query) {
  return request({
    url: '/windnacelle/camera/list',
    method: 'get',
    params: query
  })
}
