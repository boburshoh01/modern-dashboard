import type { UseFetchOptions } from 'nuxt/app'

export function useApi<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {}
) {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const defaults: UseFetchOptions<T> = {
    baseURL: config.public.apiBase,
    key: typeof url === 'string' ? url : undefined,

    onRequest({ options: reqOptions }) {
      // Add auth token if available
      if (authStore.accessToken) {
        reqOptions.headers = {
          ...reqOptions.headers,
          Authorization: `Bearer ${authStore.accessToken}`
        }
      }
    },

    onResponseError({ response }) {
      // Handle 401 unauthorized
      if (response.status === 401) {
        authStore.logout()
      }
    }
  }

  // Merge options
  const mergedOptions = {
    ...defaults,
    ...options,
    onRequest: (context: Parameters<NonNullable<UseFetchOptions<T>['onRequest']>>[0]) => {
      defaults.onRequest?.(context)
      options.onRequest?.(context)
    },
    onResponseError: (context: Parameters<NonNullable<UseFetchOptions<T>['onResponseError']>>[0]) => {
      defaults.onResponseError?.(context)
      options.onResponseError?.(context)
    }
  }

  return useFetch(url, mergedOptions as UseFetchOptions<T>)
}

export function useApiLazy<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {}
) {
  return useApi<T>(url, { ...options, lazy: true })
}
