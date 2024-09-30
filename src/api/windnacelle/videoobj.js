import request from '@/utils/request'

// 查询视频检测列表
export function listVideoobj(query) {
  return request({
    url: '/windnacelle/videoobj/list',
    method: 'get',
    params: query
  })
}

// 查询视频检测详细
export function getVideoobj(id) {
  return request({
    url: '/windnacelle/videoobj/' + id,
    method: 'get'
  })
}

// 新增视频检测
export function addVideoobj(data) {
  return request({
    url: '/windnacelle/videoobj',
    method: 'post',
    data: data
  })
}

// 修改视频检测
export function updateVideoobj(data) {
  return request({
    url: '/windnacelle/videoobj',
    method: 'put',
    data: data
  })
}

// 删除视频检测
export function delVideoobj(id) {
  return request({
    url: '/windnacelle/videoobj/' + id,
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

//视频检测
export function videoDetection(data){
  return request({
    url: '',
    method:'post',
    params:data
  })
}

//视频增强
export function videoEnhancement(data){
  return request({
    url: '',
    method:'post',
    params:data
  })
}
