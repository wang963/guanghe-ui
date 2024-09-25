import request from '@/utils/request'

// 查询摄像机配置信息列表
export function listCamera(query) {
  return request({
    url: '/fanmonitor/camera/list',
    method: 'get',
    params: query
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

// 查询摄像机配置信息详细
export function getCamera(id) {
  return request({
    url: '/fanmonitor/camera/' + id,
    method: 'get'
  })
}

// 新增摄像机配置信息
export function addCamera(data) {
  return request({
    url: '/fanmonitor/camera',
    method: 'post',
    data: data
  })
}

// 修改摄像机配置信息
export function updateCamera(data) {
  return request({
    url: '/fanmonitor/camera',
    method: 'put',
    data: data
  })
}

// 新增算法配置
export function addAlgorithm(data){
  return request({
    url: '/fanmonitor/camera/addAlgorithm',
    method: 'post',
    data: data
  })
}


// 删除摄像机配置信息
export function delCamera(id) {
  return request({
    url: '/fanmonitor/camera/' + id,
    method: 'delete'
  })
}

export function deleteStream(data) {
  return request({
    url: '/fanmonitor/camera/deleteStream',
    method: 'post',
    data: data
  })
}
