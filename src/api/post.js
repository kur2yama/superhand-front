import request from '../utils/api'

export function test(params) {
  return request({
    url: '/api/index/stream/toantileech',
    method: 'get',
    params
  })
}

// 获取首页基本设置接口 
export function getSettingApi() {
  return request({
    url: '/api/superhand/getsetting',
    method: 'get'
  })
}

// 获取首页责任单位接口 
export function getCompanysApi() {
  return request({
    url: '/api/superhand/getcompany',
    method: 'get'
  })
}

// 获取首页领衔领导接口 
export function getLeadersApi() {
  return request({
    url: '/api/superhand/getleader',
    method: 'get'
  })
}

// 获取首页项目类别接口 
export function getSubjectsApi() {
  return request({
    url: '/api/superhand/projectcat',
    method: 'get'
  })
}


// 获取二级页面项目列表接口 
export function getProjectlistApi(params) {
  return request({
    url: '/api/superhand/projectlist',
    method: 'get',
    params
  })
}


// 获取详情页面接口 
export function getProjectDetailApi(params) {
  return request({
    url: '/api/superhand/projectdetail',
    method: 'get',
    params
  })
}


// 评分接口
export function postRateApi(params) {
  return request({
    url: '/api/superhand/projectscore',
    method: 'post',
    data:params,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    transformRequest: [
      function (data) {
         let ret = ''
         for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
         }
         ret = ret.substring(0, ret.lastIndexOf('&'));
         return ret
      }
    ]
  })
}