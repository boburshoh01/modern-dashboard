import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

export const useApi = () => {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie('auth_token')

  const instance = axios.create({
    baseURL: config.public.apiBase as string,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  instance.interceptors.request.use(
    (config) => {
      if (tokenCookie.value) {
        config.headers.Authorization = `Bearer ${tokenCookie.value}`
      }
      return config
    },
    (error) => {
      console.error('Request error:', error)
      return Promise.reject(error)
    }
  )

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        tokenCookie.value = null
        navigateTo('/login')
      }
      return Promise.reject(error)
    }
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
