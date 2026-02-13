import type { AxiosRequestConfig } from "axios"
import axios from "axios"
import router from "@/router"

export function useApi() {
  const apiBase = import.meta.env.VITE_API_BASE
  // We use localStorage for token in SPA
  // or we can use a cookie library if strictly needed, but localStorage is easiest replacement for now

  const instance = axios.create({
    baseURL: apiBase,
    headers: {
      "Content-Type": "application/json",
    },
  })

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("auth_token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      console.error("Request error:", error)
      return Promise.reject(error)
    },
  )

  instance.interceptors.response.use(
    response => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("auth_token")
        router.push("/login")
      }
      return Promise.reject(error)
    },
  )

  const get = <T>(url: string, config?: AxiosRequestConfig) => {
    return instance.get<T>(url, config)
  }

  const post = <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return instance.post<T>(url, data, config)
  }

  const put = <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return instance.put<T>(url, data, config)
  }

  const del = <T>(url: string, config?: AxiosRequestConfig) => {
    return instance.delete<T>(url, config)
  }

  return {
    api: instance,
    get,
    post,
    put,
    delete: del,
  }
}

