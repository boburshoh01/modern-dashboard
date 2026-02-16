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
const oneIdLoading = ref(false)
const googleLoading = ref(false)
const imageError = ref(false)
const showPassword = ref(false)

const formState = reactive({
  username: "",
  password: "",
  rememberMe: true,
})

const errors = reactive({
  username: "",
  password: "",
})

function handleImageError() {
  imageError.value = true
}

function validateForm() {
  let isValid = true
  errors.username = ""
  errors.password = ""

  if (!formState.username.trim()) {
    errors.username = "Please enter your email or username"
    isValid = false
  }

  if (!formState.password) {
    errors.password = "Please enter your password"
    isValid = false
  } else if (formState.password.length < 6) {
    errors.password = "Password must be at least 6 characters"
    isValid = false
  }

  return isValid
}

async function handleLogin() {
  if (!validateForm()) {
    return
  }

  loading.value = true
  try {
    await authStore.login({
      username: formState.username,
      password: formState.password,
    })

    success("Login Successful", "Welcome back!")

    await router.push("/dashboard")
  } catch (err: any) {
    const errorMessage
      = err.response?.data?.message
        || "Login failed. Please check your credentials."
    error("Login Failed", errorMessage)
  } finally {
    loading.value = false
  }
}

async function handleOneIdLogin() {
  oneIdLoading.value = true
  try {
    await authStore.loginWithOneId()
  } catch (err: any) {
    const errorMessage
      = err.response?.data?.message || err.data?.message
        || "OneID bilan ulanishda xatolik yuz berdi."
    error("OneID xatolik", errorMessage)
    oneIdLoading.value = false
  }
}

async function handleGoogleLogin() {
  googleLoading.value = true
  try {
    await authStore.loginWithGoogle()
  } catch (err: any) {
    const errorMessage
      = err.response?.data?.message || err.data?.message
        || "Google bilan ulanishda xatolik yuz berdi."
    error("Google xatolik", errorMessage)
    googleLoading.value = false
  }
}

onMounted(async () => {
  const route = useRoute()
  const code = route.query.code as string

  if (code) {
    oneIdLoading.value = true
    try {
      await authStore.handleOneIdCallback(code)
      if (authStore.isAuthenticated) {
        success("Muvaffaqiyatli", "OneID orqali tizimga kirdingiz!")
        await router.push("/dashboard")
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.data?.message || "OneID orqali kirish xatosi"
      error("Xatolik", msg)
    } finally {
      oneIdLoading.value = false
      // Remove code from URL
      router.replace({ query: {} })
    }
  }
})
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
        class="bg-white border-[#b9b9b9] border-[0.3px] rounded-[24px] shadow-2xl relative min-h-[735px]"
      >
        <div class="p-[57px]">
          <div class="mb-10 text-center">
            <h1
              class="text-[32px] font-bold text-[#202224] mb-4 tracking-[-0.1143px] leading-[44px]"
            >
              {{ $t("auth.loginTitle") }}
            </h1>
            <p
              class="text-[18px] font-semibold text-[#202224] opacity-80 tracking-[-0.0643px] leading-[25px]"
            >
              {{ $t("auth.loginSubtitle") }}
            </p>
          </div>

          <form class="space-y-6" @submit.prevent="handleLogin">
            <div>
              <label
                class="block text-[16px] text-[#202224]/80 mb-2 tracking-[-0.0643px]"
              >
                {{ $t("auth.emailLabel") }}
              </label>
              <input
                v-model="formState.username"
                type="text"
                :placeholder="$t('auth.emailPlaceholder')"
                class="w-full h-14 px-4 bg-[#f1f4f9] border rounded-lg text-[16px] text-[#202224] placeholder-[#a6a6a6] focus:outline-none focus:ring-2 transition-all"
                :class="[
                  errors.username ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-[#d8d8d8] focus:border-[#4880ff] focus:ring-[#4880ff]/10',
                ]"
              />
              <p v-if="errors.username" class="mt-1 text-sm text-red-500">
                {{ errors.username }}
              </p>
            </div>

            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="text-[16px] text-[#202224]/80 tracking-[-0.0643px]">
                  {{ $t("auth.passwordLabel") }}
                </label>
                <button
                  type="button"
                  class="text-[16px] text-[#202224]/60 hover:text-[#202224]/80 transition-colors tracking-[-0.0643px] border-none bg-transparent cursor-pointer"
                >
                  {{ $t("auth.forgotPassword") }}
                </button>
              </div>
              <div class="relative">
                <input
                  v-model="formState.password"
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="$t('auth.passwordPlaceholder')"
                  class="w-full h-14 px-4 pr-12 bg-[#f1f4f9] border rounded-lg text-[16px] text-[#202224] placeholder-[#a6a6a6] focus:outline-none focus:ring-2 transition-all"
                  :class="[
                    errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-[#d8d8d8] focus:border-[#4880ff] focus:ring-[#4880ff]/10',
                  ]"
                />
                <button
                  type="button"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-[#202224]/60 hover:text-[#202224]/80"
                  @click="showPassword = !showPassword"
                >
                  <svg
                    v-if="!showPassword"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>
              <p v-if="errors.password" class="mt-1 text-sm text-red-500">
                {{ errors.password }}
              </p>
            </div>

            <div class="flex items-center gap-3">
              <input
                id="remember"
                v-model="formState.rememberMe"
                type="checkbox"
                class="w-5 h-5 rounded border-[#d8d8d8] text-[#4880ff] focus:ring-[#4880ff]/20 cursor-pointer accent-[#4880ff]"
              />
              <label
                for="remember"
                class="text-[16px] text-[#202224]/60 cursor-pointer select-none tracking-[-0.0643px]"
              >
                {{ $t("auth.rememberMe") }}
              </label>
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
              {{ $t("auth.signIn") }}
            </button>

            <!-- Divider -->
            <div class="flex items-center gap-4 py-2">
              <div class="flex-1 h-[1px] bg-[#d8d8d8]" />
              <span class="text-[14px] text-[#202224]/50 font-semibold whitespace-nowrap">
                {{ $t("auth.orDivider") }}
              </span>
              <div class="flex-1 h-[1px] bg-[#d8d8d8]" />
            </div>

            <!-- OneID Login Button -->
            <button
              type="button"
              :disabled="oneIdLoading || googleLoading"
              class="w-full h-14 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-[16px] font-bold rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 border-none cursor-pointer shadow-md hover:shadow-lg mb-3"
              @click="handleOneIdLogin"
            >
              <svg
                v-if="oneIdLoading"
                class="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {{ $t("auth.oneIdLogin") }}
            </button>

            <!-- Google Login Button -->
            <button
              type="button"
              :disabled="googleLoading || oneIdLoading"
              class="w-full h-14 bg-white border border-[#d8d8d8] hover:bg-gray-50 text-[#202224] text-[16px] font-bold rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer shadow-sm hover:shadow"
              @click="handleGoogleLogin"
            >
              <svg
                v-if="googleLoading"
                class="animate-spin h-5 w-5 text-[#4880ff]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <svg 
                v-else
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 48 48" 
                class="h-6 w-6"
              >
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              {{ $t("auth.googleLogin") || "Google orqali kirish" }}
            </button>

            <div class="text-center pt-2">
              <span class="text-[16px] text-[#202224]/65 tracking-[-0.0643px]">
                {{ $t("auth.noAccount") }}
              </span>
              <button
                type="button"
                class="ml-1 text-[16px] font-bold text-[#5a8cff] underline hover:text-[#4880ff] transition-colors border-none bg-transparent cursor-pointer"
              >
                {{ $t("auth.createAccount") }}
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
