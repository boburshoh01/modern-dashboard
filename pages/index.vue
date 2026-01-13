<script setup lang="ts">
const authStore = useAuthStore()

authStore.initializeAuth()

if (authStore.isAuthenticated && authStore.token) {
  await navigateTo('/dashboard', { replace: true })
} else {
  await navigateTo('/login', { replace: true })
}
</script>
