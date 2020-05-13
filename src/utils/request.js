import axios from 'axios'
import store from '@/store'
import { getToken } from './auth'

import iView from 'view-design'
const Progress= iView
// create an axios instance
const service = axios.create({
  baseURL: '/api',
  withCredentials: false,
  timeout: 10000
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // if (store.getters.token) {
      config.headers['Authorization'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJSb2xlcyI6WyJhZG1pbiIsIjEwMDEiLCIxMjciXSwiUm9sZUlEcyI6bnVsbH0.zaiYZLcEbRin9z4-mr8UQm9BtofJDymQV6lrqJ5utLE'
    // }
    return config
  },
  (error) => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 200) {
      Progress.Notice.open({
        title: '请求返回Code非200',
        desc: res.msg
      });
      Progress.LoadingBar.error()
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  (error) => {
    Progress.Notice.error({
      title: '发生一个错误',
      desc: error.message
    });
    Progress.LoadingBar.error()
    return Promise.reject(error)
  }
)

export default service
