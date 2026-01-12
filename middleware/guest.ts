export default defineNuxtRouteMiddleware(() => {
  try {
    const token = useCookie('auth_token')

    // If user has valid token, redirect to dashboard
    if (token.value) {
      return navigateTo('/dashboard')
    }
  } catch (error) {
    console.error('Guest middleware error:', error)
    // Allow access on error (fail open for guest pages)
  }
})
