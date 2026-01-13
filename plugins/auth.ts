export default defineNuxtPlugin({
  name: 'auth',
  parallel: true,
  async setup() {
    const authStore = useAuthStore()
    // Initialize auth state from cookie (non-blocking)
    await authStore.initializeAuth()
  }
})
