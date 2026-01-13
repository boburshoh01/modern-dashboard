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

          <form @submit.prevent="handleLogin" class="space-y-6">
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
                :class="[
                  'w-full h-14 px-4 bg-[#f1f4f9] border rounded-lg text-[16px] text-[#202224] placeholder-[#a6a6a6] focus:outline-none focus:ring-2 transition-all',
                  errors.username ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-[#d8d8d8] focus:border-[#4880ff] focus:ring-[#4880ff]/10'
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
                  class="text-[16px] text-[#202224]/60 hover:text-[#202224]/80 transition-colors tracking-[-0.0643px]"
                >
                  {{ $t("auth.forgotPassword") }}
                </button>
              </div>
              <div class="relative">
                <input
                  v-model="formState.password"
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="$t('auth.passwordPlaceholder')"
                  :class="[
                    'w-full h-14 px-4 pr-12 bg-[#f1f4f9] border rounded-lg text-[16px] text-[#202224] placeholder-[#a6a6a6] focus:outline-none focus:ring-2 transition-all',
                    errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-[#d8d8d8] focus:border-[#4880ff] focus:ring-[#4880ff]/10'
                  ]"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-[#202224]/60 hover:text-[#202224]/80"
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
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ $t("auth.signIn") }}
            </button>

            <div class="text-center pt-2">
              <span class="text-[16px] text-[#202224]/65 tracking-[-0.0643px]">
                {{ $t("auth.noAccount") }}
              </span>
              <button
                type="button"
                class="ml-1 text-[16px] font-bold text-[#5a8cff] underline hover:text-[#4880ff] transition-colors"
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

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useNotification } from "~/composables/useNotification";

definePageMeta({
  layout: false,
  middleware: "guest",
});

const authStore = useAuthStore();
const { success, error } = useNotification();
const router = useRouter();

const loading = ref(false);
const imageError = ref(false);
const showPassword = ref(false);

const formState = reactive({
  username: "",
  password: "",
  rememberMe: true,
});

const errors = reactive({
  username: "",
  password: "",
});

const handleImageError = () => {
  imageError.value = true;
};

const validateForm = () => {
  let isValid = true;
  errors.username = "";
  errors.password = "";

  if (!formState.username.trim()) {
    errors.username = "Please enter your email or username";
    isValid = false;
  }

  if (!formState.password) {
    errors.password = "Please enter your password";
    isValid = false;
  } else if (formState.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
    isValid = false;
  }

  return isValid;
};

const handleLogin = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  try {
    await authStore.login({
      username: formState.username,
      password: formState.password,
    });

    success("Login Successful", "Welcome back!");

    await router.push("/dashboard");
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.message ||
      "Login failed. Please check your credentials.";
    error("Login Failed", errorMessage);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
* {
  font-family: "Nunito Sans", sans-serif;
}
</style>
