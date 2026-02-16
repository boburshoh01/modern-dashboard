<script setup lang="ts">
import { useNotification } from "~/composables/useNotification"
import { useAuthStore } from "~/stores/auth"

definePageMeta({
  layout: false,
  middleware: "guest",
})

const authStore = useAuthStore()
const { success, error } = useNotification()
const router = useRouter()

const loading = ref(false)
const imageError = ref(false)
const sent = ref(false)

const email = ref("")
const emailError = ref("")

function handleImageError() {
  imageError.value = true
}

function validateForm() {
  let isValid = true
  emailError.value = ""

  if (!email.value.trim()) {
    emailError.value = "Please enter your email"
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = "Please enter a valid email address"
    isValid = false
  }

  return isValid
}

async function handleForgotPassword() {
  if (!validateForm()) {
    return
  }

  loading.value = true
  try {
    await authStore.forgotPassword(email.value)
    sent.value = true
    success("Success", "Password reset link sent to your email")
  } catch (err: any) {
    const errorMessage
      = err.response?.data?.message
        || "Failed to send reset link. Please try again."
    error("Error", errorMessage)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-[#4880ff] relative overflow-hidden flex items-center justify-center"
  >
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-[67.52%] -right-[46.32%] -bottom-[49.4%] -left-[13.96%]"
      >
        <img
          src="https://www.figma.com/api/mcp/asset/5d02d115-6b15-4287-962e-c1e6e7f6dca0"
          alt="Background Shape"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
        <svg
          v-if="imageError"
          class="w-full h-full"
          viewBox="0 0 2308 2321"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="272.5"
            cy="932.5"
            rx="447.5"
            ry="447.5"
            fill="white"
            opacity="0.1"
          />
          <ellipse
            cx="2184.67"
            cy="62.53"
            rx="603.56"
            ry="603.56"
            fill="white"
            opacity="0.08"
          />
          <ellipse
            cx="1519.7"
            cy="1027.52"
            rx="573.57"
            ry="573.57"
            fill="white"
            opacity="0.1"
          />
          <ellipse
            cx="1440.11"
            cy="2064.64"
            rx="666.11"
            ry="666.11"
            fill="white"
            opacity="0.08"
          />
        </svg>
      </div>
    </div>

    <div class="relative z-10 w-full max-w-[630px] px-4">
      <div
        class="bg-white border-[#b9b9b9] border-[0.3px] rounded-[24px] shadow-2xl relative min-h-[500px] flex flex-col justify-center"
      >
        <div class="p-[57px]">
          <div class="mb-10 text-center">
            <h1
              class="text-[32px] font-bold text-[#202224] mb-4 tracking-[-0.1143px] leading-[44px]"
            >
              {{ sent ? "Check Your Email" : "Forgot Password?" }}
            </h1>
            <p
              class="text-[18px] font-semibold text-[#202224] opacity-80 tracking-[-0.0643px] leading-[25px]"
            >
              {{ sent ? `We sent a password reset link to ${email}` : "Enter your email details to recover your password" }}
            </p>
          </div>

          <div v-if="sent" class="text-center">
             <button
              type="button"
              class="w-full h-14 bg-[#4880ff] hover:bg-[#3a6fcc] text-white text-[18px] font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mb-4"
              @click="router.push('/login')"
            >
              Back to Login
            </button>
             <button
              type="button"
              class="text-[#4880ff] font-bold hover:underline"
              @click="sent = false"
            >
              Resend email
            </button>
          </div>

          <form v-else class="space-y-6" @submit.prevent="handleForgotPassword">
            <div>
              <label
                class="block text-[16px] text-[#202224]/80 mb-2 tracking-[-0.0643px]"
              >
                Email
              </label>
              <input
                v-model="email"
                type="email"
                placeholder="Enter your email"
                class="w-full h-14 px-4 bg-[#f1f4f9] border rounded-lg text-[16px] text-[#202224] placeholder-[#a6a6a6] focus:outline-none focus:ring-2 transition-all"
                :class="[
                  emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-[#d8d8d8] focus:border-[#4880ff] focus:ring-[#4880ff]/10',
                ]"
              />
              <p v-if="emailError" class="mt-1 text-sm text-red-500">
                {{ emailError }}
              </p>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full h-14 bg-[#4880ff] hover:bg-[#3a6fcc] text-white text-[18px] font-bold rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg
                v-if="loading"
                class="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Recover Password
            </button>

            <div class="text-center pt-2">
              <button
                type="button"
                class="text-[16px] font-bold text-[#202224]/60 hover:text-[#202224] transition-colors border-none bg-transparent cursor-pointer"
                @click="router.push('/login')"
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  font-family: "Nunito Sans", sans-serif;
}
</style>
