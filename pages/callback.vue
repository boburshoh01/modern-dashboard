<script setup lang="ts">
import { useNotification } from "~/composables/useNotification"
import { useAuthStore } from "~/stores/auth"

definePageMeta({
  layout: false,
  middleware: "guest",
})

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { success, error } = useNotification()
const loading = ref(true)
const errorMessage = ref("")

onMounted(async () => {
  const code = route.query.code as string
  const provider = route.query.provider as string || "GOOGLE" // Default to Google if not specified, or checks both?

  if (!code) {
    errorMessage.value = "Authorization code topilmadi"
    error("Xatolik", "Authorization code kelmadi")
    setTimeout(() => router.push("/login"), 3000)
    return
  }

  try {
    if (provider === "GOOGLE") {
        await authStore.handleGoogleCallback(code)
    } else {
        // Fallback or other providers
        // If OneID ever uses this page, we can add it here.
        // For now, OneID uses /login page logic.
        errorMessage.value = "Noma'lum provayder"
        throw new Error("Unknown provider")
    }

    if (authStore.isAuthenticated) {
      success("Muvaffaqiyatli", "Tizimga muvaffaqiyatli kirdingiz!")
      await router.push("/dashboard")
    } else {
      throw new Error("Autentifikatsiya amalga oshmadi")
    }
  } catch (err: any) {
    const msg = err.response?.data?.message || err.data?.message || err.message || "Kirish xatosi"
    errorMessage.value = msg
    error("Xatolik", msg)
    setTimeout(() => router.push("/login"), 3000)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#4880ff] relative overflow-hidden flex items-center justify-center">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
       <div class="absolute inset-0 bg-gradient-to-br from-[#4880ff] to-[#3a6fcc]" />
    </div>

    <div class="relative z-10 text-center">
      <!-- Loading Spinner -->
      <div v-if="loading" class="flex flex-col items-center gap-6">
        <svg
          class="animate-spin h-16 w-16 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p class="text-white text-xl font-semibold">
          Tizimga kirilmoqda...
        </p>
        <p class="text-white/70 text-sm">
          Iltimos, kutib turing
        </p>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="flex flex-col items-center gap-4">
        <div class="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p class="text-white text-xl font-semibold">
          {{ errorMessage }}
        </p>
        <p class="text-white/70 text-sm">
          Login sahifasiga qaytarilmoqda...
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  font-family: "Nunito Sans", sans-serif;
}
</style>
