export default defineNuxtRouteMiddleware(async (_to, _from) => {
  try {
    const token = useCookie('auth_token')

    if (!token.value) {
      return navigateTo('/login')
    }

    const authStore = useAuthStore()
    if (!authStore.isAuthenticated && token.value) {
      await authStore.initializeAuth()
    }

    if (!authStore.isAuthenticated) {
      return navigateTo('/login')
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return navigateTo('/login')
  }
})
