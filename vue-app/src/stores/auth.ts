import type { AuthUser, LoginCredentials } from "@/types"
import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { useApi } from "@/composables/useApi"

export const useAuthStore = defineStore("auth", () => {
  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const { get, post } = useApi()

  const isAuthenticated = computed(() => !!token.value)
  const userProfile = computed(() => user.value)

  async function login(credentials: LoginCredentials) {
    const { data } = await post<any>("/auth/login", credentials)
    if (data.token) {
      token.value = data.token
      user.value = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        image: data.image,
        token: data.token,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      }
      if (data.refreshToken) {
        refreshToken.value = data.refreshToken
      }
    }
  }

  // OneID: Get authorization URL and redirect user to OneID
  async function loginWithOneId() {
    const redirectUrl = import.meta.env.VITE_ONEID_REDIRECT_URL || `${window.location.origin}/oauth/callback`
    const { data } = await get<any>("/auth/oauth/authorize/url", {
      params: { redirect_url: redirectUrl },
    })
    // The API should return the OneID authorization URL
    if (data && (data.url || data.data?.url || typeof data === "string")) {
      const authUrl = data.url || data.data?.url || data
      window.location.href = authUrl
    }
  }

  // OneID: Handle the callback with authorization code
  async function handleOneIdCallback(code: string) {
    const { data } = await get<any>("/auth/oauth/login", {
      params: { code },
    })
    if (data) {
      // Extract token - handle different response shapes
      const accessToken = data.token || data.access_token || data.data?.token || data.data?.access_token
      const refresh = data.refreshToken || data.refresh_token || data.data?.refreshToken || data.data?.refresh_token

      if (accessToken) {
        token.value = accessToken
        if (refresh) {
          refreshToken.value = refresh
        }
        // Set user info if available
        user.value = {
          id: data.id || data.data?.id || 0,
          username: data.username || data.data?.username || "",
          email: data.email || data.data?.email || "",
          firstName: data.firstName || data.first_name || data.data?.firstName || data.data?.first_name || "",
          lastName: data.lastName || data.last_name || data.data?.lastName || data.data?.last_name || "",
          gender: data.gender || data.data?.gender || "",
          image: data.image || data.data?.image || "",
          token: accessToken,
          accessToken,
          refreshToken: refresh,
        }
      }
    }
  }

  // Refresh auth token
  async function refreshAuthToken() {
    if (!refreshToken.value)
      return
    try {
      const { data } = await get<any>("/auth/refresh-token", {
        params: { refresh_token: refreshToken.value },
      })
      if (data) {
        const newToken = data.token || data.access_token || data.data?.token
        const newRefresh = data.refreshToken || data.refresh_token || data.data?.refreshToken
        if (newToken) {
          token.value = newToken
        }
        if (newRefresh) {
          refreshToken.value = newRefresh
        }
      }
    } catch {
      // If refresh fails, logout
      await logout()
    }
  }

  async function logout() {
    token.value = null
    user.value = null
    refreshToken.value = null
  }

  function setUser(newUser: AuthUser) {
    user.value = newUser
  }

  function setToken(newToken: string) {
    token.value = newToken
  }

  return {
    user,
    token,
    refreshToken,
    isAuthenticated,
    userProfile,
    login,
    loginWithOneId,
    handleOneIdCallback,
    refreshAuthToken,
    logout,
    setUser,
    setToken,
  }
}, {
  persist: {
    key: "auth",
    storage: localStorage,
    pick: ["token", "user", "refreshToken"],
  },
})
