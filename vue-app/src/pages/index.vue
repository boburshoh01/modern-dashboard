<script setup lang="ts">
import { useAuthStore } from "@/stores/auth"
import { useRouter } from "vue-router"
import { onMounted } from "vue"

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  // Use initialized auth state (assuming it's synchronous or already loaded by persisted state)
  // If initializeAuth is async, await it
  // await authStore.initializeAuth() 
  
  if (authStore.isAuthenticated && authStore.token) {
    router.replace("/dashboard")
  } else {
    router.replace("/login")
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <a-spin size="large" />
  </div>
</template>
