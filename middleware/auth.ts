export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/forgot-password']

  // Check if the route is public
  const isPublicRoute = publicRoutes.includes(to.path)

  // If user is not authenticated and trying to access protected route
  if (!authStore.isLoggedIn && !isPublicRoute) {
    return navigateTo('/login')
  }

  // If user is authenticated and trying to access auth pages
  if (authStore.isLoggedIn && isPublicRoute) {
    return navigateTo('/')
  }
})
