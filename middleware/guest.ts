export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  // If user is already authenticated, redirect to dashboard
  if (authStore.isLoggedIn) {
    return navigateTo('/')
  }
})
