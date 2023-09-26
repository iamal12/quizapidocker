import axios from "axios";
import { SESSION } from "../../constants/common";

const BASE_URL = import.meta.env.VITE_BASE_URL

console.log('BASE', import.meta.env)

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

axiosInstance.interceptors.request.use(function (config) {
    const token = localStorage.getItem(SESSION)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

axiosInstance.interceptors.response.use(res => res, err => {
    const { status } = err.response
    if (status === 403 || status === 401) {
        localStorage.setItem(SESSION, '')
        window.location.href = '/'
    }
    return Promise.reject(err)
})