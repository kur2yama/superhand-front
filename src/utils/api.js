import axios from 'axios'
import store from '../store'

export default function request(config) {
  //1，创建实例
  // axios.defaults.withCredentials = true;
  const instance = axios.create({
    baseURL: '/',
    timeout: 5000
  });
  //2，设置axios拦截器
  //2.1 请求时的拦截器
  instance.interceptors.request.use(config => {
    store.state.isLoading = true;
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    //展示进度条
    // Nprogress.start()
    //为请求头对象添加 token 验证的自定义 Authorization 字段
    // config.headers.Authorization = window.sessionStorage.getItem('token');
    // config.headers['Device-ID'] =  window.localStorage.getItem('Device-ID')
    //打包前打开 ↓↓↓↓↓
    config.url = config.url.split(/\/api\//)[1];
    return config
  }, error => {
    console.log('请求失败', error);
    return error
  });
  //2.2 响应时的拦截
  instance.interceptors.response.use(res => {
    store.state.isLoading = false;
    //隐藏进度条
    // Nprogress.done()
    return res.data
  }, error => {
    console.log('响应失败');
    return error
  });
  //3，发送真正的请求
  return instance(config)
}

// import Nprogress from 'nprogress'
// import 'nprogress/nprogress.css'

// export function $axios(config) {
//   //1，创建实例
//   const instance = axios.create({
//     baseURL: '',
//     timeout: 5000
//   });
//   //2，设置axios拦截器
//   //2.1 请求时的拦截器
//   instance.interceptors.request.use(config => {
//     //展示进度条
//     // Nprogress.start()
//     //为请求头对象添加 token 验证的自定义 Authorization 字段
//     config.headers.Authorization = window.sessionStorage.getItem('token');
//     return config
//   }, error => {
//     console.log('请求失败', error);
//     return error
//   });
//   //2.2 响应时的拦截
//   instance.interceptors.response.use(res => {
//     //隐藏进度条
//     // Nprogress.done()
//     return res.data
//   }, error => {
//     console.log('响应失败');
//     return error
//   });
//   //3，发送真正的请求
//   return instance(config)
// }
