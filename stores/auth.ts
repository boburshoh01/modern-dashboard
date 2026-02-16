import type { AuthUser, LoginCredentials, RefreshTokenResponse } from "~/types"
import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as AuthUser | null,
    token: null as string | null,
    isAuthenticated: false,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    currentUser: state => state.user,
    isLoggedIn: state => state.isAuthenticated && !!state.token,
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null
      const config = useRuntimeConfig()

      const tokenCookie = useCookie("auth_token", {
        maxAge: 60 * 60 * 24 * 7,
        secure: import.meta.env.PROD,
        sameSite: "strict",
      })

      try {
        const response = await $fetch<AuthUser>("/auth/login", {
          method: "POST",
          body: credentials,
          baseURL: config.public.apiBase as string,
        })

        this.user = {
          ...response,
          token: response.accessToken || "",
        }
        this.token = response.accessToken || null
        this.isAuthenticated = true
        tokenCookie.value = response.accessToken || null

        return response
      } catch (err) {
        this.error = err instanceof Error ? err.message : "Login failed"
        console.error("Login error:", err)
        throw err
      } finally {
        this.loading = false
      }
    },

    // OneID: Get authorization URL and redirect user to OneID
    async loginWithOneId() {
      this.loading = true
      this.error = null
      const config = useRuntimeConfig()

      try {
        const redirectUrl = `${window.location.origin}/login`
        const data = await $fetch<any>("/auth/oauth/authorize/url", {
          method: "GET",
          baseURL: config.public.apiBase as string,
          params: { redirect_url: redirectUrl },
        })

        // The API should return the OneID authorization URL
        const authUrl = data?.data?.authorize_url || data?.authorize_url || data?.url || data?.data?.url
        if (authUrl) {
          window.location.href = authUrl
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : "OneID login failed"
        console.error("OneID login error:", err)
        throw err
      } finally {
        this.loading = false
      }
    },

    // Google: Get authorization URL and redirect user to Google
    async loginWithGoogle() {
      this.loading = true
      this.error = null
      const config = useRuntimeConfig()

      try {
        // We might want to specify a redirect URL if the backend supports it,
        // otherwise it might default to /callback
        const redirectUrl = `${window.location.origin}/callback`
        const data = await $fetch<any>("/oauth/external/authorize/url", {
          method: "GET",
          baseURL: config.public.apiBase as string,
          params: {
            provider: "GOOGLE",
            redirect_url: redirectUrl
          },
        })

        const authUrl = data?.data?.authorize_url || data?.authorize_url
        if (authUrl) {
          window.location.href = authUrl
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : "Google login failed"
        console.error("Google login error:", err)
        throw err
      } finally {
        this.loading = false
      }
    },

    // OneID: Handle the callback with authorization code
    async handleOneIdCallback(code: string) {
      this.loading = true
      this.error = null
      const config = useRuntimeConfig()

      const tokenCookie = useCookie("auth_token", {
        maxAge: 60 * 60 * 24 * 7,
        secure: import.meta.env.PROD,
        sameSite: "strict",
      })

      try {
        const data = await $fetch<any>("/auth/oauth/login", {
          method: "GET",
          baseURL: config.public.apiBase as string,
          params: { code },
        })

        this.handleAuthResponse(data, tokenCookie)
      } catch (err) {
        this.error = err instanceof Error ? err.message : "OneID callback failed"
        console.error("OneID callback error:", err)
        throw err
      } finally {
        this.loading = false
      }
    },

    // Google: Handle the callback with authorization code
    async handleGoogleCallback(code: string) {
      this.loading = true
      this.error = null
      const config = useRuntimeConfig()

      const tokenCookie = useCookie("auth_token", {
        maxAge: 60 * 60 * 24 * 7,
        secure: import.meta.env.PROD,
        sameSite: "strict",
      })

      try {
        const data = await $fetch<any>("/oauth/external/login", {
          method: "POST",
          baseURL: config.public.apiBase as string,
          params: {
            provider: "GOOGLE",
            code
          },
        })

        this.handleAuthResponse(data, tokenCookie)
      } catch (err) {
        this.error = err instanceof Error ? err.message : "Google callback failed"
        console.error("Google callback error:", err)
        throw err
      } finally {
        this.loading = false
      }
    },

    // Helper to handle successful auth response
    handleAuthResponse(data: any, tokenCookie: any) {
      if (data) {
        // Extract token - handle different response shapes
        const accessToken = data.token || data.access_token || data.data?.token || data.data?.access_token
        const refreshTkn = data.refreshToken || data.refresh_token || data.data?.refreshToken || data.data?.refresh_token

        if (accessToken) {
          this.token = accessToken
          this.isAuthenticated = true
          tokenCookie.value = accessToken

          // Set user info if available
          this.user = {
            id: data.id || data.data?.id || 0,
            username: data.username || data.data?.username || "",
            email: data.email || data.data?.email || "",
            firstName: data.firstName || data.first_name || data.data?.firstName || data.data?.first_name || "",
            lastName: data.lastName || data.last_name || data.data?.lastName || data.data?.last_name || "",
            gender: data.gender || data.data?.gender || "",
            image: data.image || data.data?.image || "",
            token: accessToken,
            accessToken,
            refreshToken: refreshTkn,
          }
        }
      }
    },

    async logout() {
      const tokenCookie = useCookie("auth_token")

      this.user = null
      this.token = null
      this.isAuthenticated = false
      tokenCookie.value = null

      return navigateTo("/login")
    },

    async fetchUser(skipNavigation = false) {
      this.loading = true
      this.error = null
      const tokenCookie = useCookie("auth_token")

      // Skip fetching user if we already have user data (e.g., from OneID login)
      if (this.user && this.isAuthenticated) {
        this.loading = false
        return
      }

      try {
        // With OneID, we don't have a /auth/me endpoint
        // If we have a token but no user, just mark as authenticated
        if (tokenCookie.value && !this.user) {
          this.token = tokenCookie.value as string
          this.isAuthenticated = true
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : "Failed to fetch user"
        console.error("Fetch user error:", err)
        this.user = null
        this.token = null
        this.isAuthenticated = false

        if (!skipNavigation) {
          await navigateTo("/login")
        }
      } finally {
        this.loading = false
      }
    },

    async refreshAuthToken() {
      this.loading = true
      this.error = null
      const config = useRuntimeConfig()
      const tokenCookie = useCookie("auth_token")

      try {
        if (!this.user?.refreshToken) {
          throw new Error("No refresh token available")
        }

        const response = await $fetch<RefreshTokenResponse>("/auth/refresh-token", {
          method: "GET",
          baseURL: config.public.apiBase as string,
          params: { refresh_token: this.user.refreshToken },
        })

        this.token = response.token
        tokenCookie.value = response.token

        return response.token
      } catch (err) {
        this.error = err instanceof Error ? err.message : "Failed to refresh token"
        console.error("Refresh token error:", err)
        this.user = null
        this.token = null
        this.isAuthenticated = false
        await navigateTo("/login")
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
      const tokenCookie = useCookie("auth_token")

      if (tokenCookie.value) {
        this.token = tokenCookie.value as string
        this.isAuthenticated = true

        // If we already have user data, skip fetch
        if (!this.user) {
          // With OneID we don't have /auth/me, so just trust the token
          this.isAuthenticated = true
        }
      }
    },
  },

  persist: true,
})
