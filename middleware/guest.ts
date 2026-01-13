export default defineNuxtRouteMiddleware(() => {
  try {
    const token = useCookie('auth_token')

    if (token.value) {
      return navigateTo('/dashboard')
    }
  } catch (error) {
    console.error('Guest middleware error:', error)
  }
})
