export default defineNuxtPlugin({
  name: 'auth',
  parallel: true,
  async setup() {
    const authStore = useAuthStore()
    await authStore.initializeAuth()
  }
})
