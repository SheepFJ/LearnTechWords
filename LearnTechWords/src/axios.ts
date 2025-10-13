// src/axios.js
import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import router from '@/router'
import { myhost } from '@/types/myhost'

// 你的后端地址
axios.defaults.baseURL = myhost.api

// 请求拦截器：自动带 token
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('user_token')
        if (token) {
            config.headers.Authorization = token
        }
        return config
    },
    error => Promise.reject(error)
)

// 响应拦截器：处理 token 过期
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // 说明 token 无效或过期
            localStorage.removeItem('user_token')
            alert('登陆信息已过期，请重新登陆。')
            router.push('/login')
        }
        return Promise.reject(error)
    }
)

// 封装请求函数
export function request(options: AxiosRequestConfig): Promise<any> {
    return axios(options).then((res: AxiosResponse) => res.data)
}

export default axios
