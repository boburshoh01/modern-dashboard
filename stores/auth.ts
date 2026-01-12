import { defineStore } from 'pinia'
import type { AuthUser, LoginCredentials, RefreshTokenResponse } from '~/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    token: null as string | null,
    isAuthenticated: false,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated && !!state.token,
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null
      const config = useRuntimeConfig()

      const tokenCookie = useCookie('auth_token', {
        maxAge: 60 * 60 * 24 * 7,
        secure: true,
        sameSite: 'strict'
      })

      try {
        const response = await $fetch<AuthUser>('/auth/login', {
          method: 'POST',
          body: credentials,
          baseURL: config.public.apiBase as string
        })

        this.user = {
          ...response,
          token: response.accessToken || ''
        }
        this.token = response.accessToken || null
        this.isAuthenticated = true
        tokenCookie.value = response.accessToken || null

        return response
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Login failed'
        console.error('Login error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async logout() {
      const tokenCookie = useCookie('auth_token')

      this.user = null
      this.token = null
      this.isAuthenticated = false
      tokenCookie.value = null

      return navigateTo('/login')
    },

    async fetchUser(skipNavigation = false) {
      this.loading = true
      this.error = null
      const config = useRuntimeConfig()
      const tokenCookie = useCookie('auth_token')

      try {
        const userData = await $fetch<AuthUser>('/auth/me', {
          method: 'GET',
          baseURL: config.public.apiBase as string,
          headers: {
            Authorization: `Bearer ${tokenCookie.value}`
          }
        })

        this.user = userData
        this.isAuthenticated = true

        if (tokenCookie.value && !this.token) {
          this.token = tokenCookie.value as string
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch user'
        console.error('Fetch user error:', err)
        this.user = null
        this.token = null
        this.isAuthenticated = false

        if (!skipNavigation) {
          await navigateTo('/login')
        }
      } finally {
        this.loading = false
      }
    },

    async refreshToken() {
      this.loading = true
      this.error = null
      const config = useRuntimeConfig()
      const tokenCookie = useCookie('auth_token')

      try {
        if (!tokenCookie.value) {
          throw new Error('No token available')
        }

        const response = await $fetch<RefreshTokenResponse>('/auth/refresh', {
          method: 'POST',
          body: { refreshToken: tokenCookie.value },
          baseURL: config.public.apiBase as string
        })

        this.token = response.token
        tokenCookie.value = response.token

        return response.token
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to refresh token'
        console.error('Refresh token error:', err)
        this.user = null
        this.token = null
        this.isAuthenticated = false
        await navigateTo('/login')
        throw err
      } finally {
        this.loading = false
      }
    },

    setUser(userData: AuthUser) {
      this.user = userData
      this.isAuthenticated = true
    },

    async initializeAuth() {
      const tokenCookie = useCookie('auth_token')

      if (tokenCookie.value) {
        this.token = tokenCookie.value as string

        await this.fetchUser(true)

        if (!this.user) {
          console.warn('Token validation failed during initialization')
          tokenCookie.value = null
          this.token = null
          this.isAuthenticated = false
        }
      }
    },
  },

  persist: true,
})
