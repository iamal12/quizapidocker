import axios from "axios";
import { useUserStore } from "../../store/user.store";

const BASE_URL = import.meta.env.VITE_BASE_URL

console.log('BASE', import.meta.env)

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

axiosInstance.interceptors.request.use(function (config) {
    const token = useUserStore.getState().authToken
    config.headers.Authorization = `Bearer ${token}`
    return config
})
