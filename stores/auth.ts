import { defineStore } from 'pinia'
import type { User, LoginCredentials } from '~/types'
import type { LoginResponse } from '~/types/api'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.accessToken,
    isLoggedIn: (state) => state.isAuthenticated && !!state.accessToken,
    userFullName: (state) =>
      state.user ? `${state.user.firstName} ${state.user.lastName}` : '',
    userRole: (state) => state.user?.role || 'user'
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<LoginResponse>(
          `${config.public.apiBase}/auth/login`,
          {
            method: 'POST',
            body: {
              username: credentials.username,
              password: credentials.password,
              expiresInMins: credentials.expiresInMins || 60
            }
          }
        )

        this.accessToken = response.accessToken
        this.refreshToken = response.refreshToken
        this.isAuthenticated = true

        // Fetch full user data
        await this.fetchUser()

        return { success: true }
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } }
        this.error = err.data?.message || 'Login failed'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      if (!this.accessToken) return

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<User>(`${config.public.apiBase}/auth/me`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        })

        this.user = response
      } catch (error) {
        console.error('Failed to fetch user:', error)
        // Token might be expired, try to refresh
        await this.refreshTokens()
      }
    },

    async refreshTokens() {
      if (!this.refreshToken) {
        this.logout()
        return
      }

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{
          accessToken: string
          refreshToken: string
        }>(`${config.public.apiBase}/auth/refresh`, {
          method: 'POST',
          body: {
            refreshToken: this.refreshToken,
            expiresInMins: 60
          }
        })

        this.accessToken = response.accessToken
        this.refreshToken = response.refreshToken

        // Retry fetching user
        await this.fetchUser()
      } catch {
        this.logout()
      }
    },

    logout() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      this.isAuthenticated = false
      this.error = null

      // Redirect to login
      navigateTo('/login')
    },

    clearError() {
      this.error = null
    }
  },

  persist: {
    key: 'auth',
    pick: ['accessToken', 'refreshToken', 'isAuthenticated', 'user']
  }
})
