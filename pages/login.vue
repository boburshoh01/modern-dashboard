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

          <a-form
            :model="formState"
            :rules="rules"
            layout="vertical"
            class="space-y-6"
            @finish="handleLogin"
            @finish-failed="handleLoginFailed"
          >
            <div>
              <label
                class="block text-[18px] font-semibold text-[#202224] opacity-80 mb-2 tracking-[-0.0643px] leading-[25px]"
              >
                {{ $t("auth.emailLabel") }}
              </label>
              <a-input
                v-model:value="formState.username"
                size="large"
                :placeholder="$t('auth.emailPlaceholder')"
                class="h-14 rounded-[8px]"
              />
            </div>

            <div>
              <div class="flex justify-between items-center mb-2">
                <label
                  class="block text-[18px] font-semibold text-[#202224] opacity-80 tracking-[-0.0643px] leading-[25px]"
                >
                  {{ $t("auth.passwordLabel") }}
                </label>
                <a-button
                  type="link"
                  class="p-0 h-auto text-[18px] font-semibold text-[#202224] opacity-60 tracking-[-0.0643px] leading-[25px] hover:opacity-80"
                >
                  {{ $t("auth.forgotPassword") }}
                </a-button>
              </div>
              <a-input-password
                v-model:value="formState.password"
                size="large"
                :placeholder="$t('auth.passwordPlaceholder')"
                class="h-14 rounded-[8px]"
              />
            </div>

            <div class="flex items-center gap-2">
              <a-checkbox
                v-model:checked="formState.rememberMe"
                class="rounded-[6px]"
              />
              <span
                class="text-[18px] font-semibold text-[#202224] opacity-60 tracking-[-0.0643px] leading-[25px]"
              >
                {{ $t("auth.rememberMe") }}
              </span>
            </div>

            <a-button
              type="primary"
              html-type="submit"
              size="large"
              block
              :loading="loading"
              class="h-14 bg-[#4880ff] opacity-90 hover:opacity-100 rounded-[8px] text-white text-[20px] font-bold tracking-[-0.0714px] leading-[27px] border-0 mt-6"
            >
              {{ $t("auth.signIn") }}
            </a-button>

            <div class="text-center pt-6">
              <span
                class="text-[18px] font-semibold text-[#202224] opacity-[0.65] tracking-[-0.0643px] leading-[25px]"
              >
                {{ $t("auth.noAccount") }}
              </span>
              <a-button
                type="link"
                class="p-0 h-auto ml-1 text-[18px] font-bold text-[#5a8cff] underline tracking-[-0.0643px] leading-[25px] hover:text-[#4880ff]"
                style="
                  text-decoration-skip-ink: none;
                  text-underline-position: from-font;
                "
              >
                {{ $t("auth.createAccount") }}
              </a-button>
            </div>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import type { Rule } from "ant-design-vue/es/form";
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

const formState = reactive({
  username: "",
  password: "",
  rememberMe: true,
});

const handleImageError = () => {
  imageError.value = true;
};

const rules: Record<string, Rule[]> = {
  username: [
    {
      required: true,
      message: "Please enter your email or username",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "Please enter your password", trigger: "blur" },
    {
      min: 6,
      message: "Password must be at least 6 characters",
      trigger: "blur",
    },
  ],
};

const handleLogin = async () => {
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

const handleLoginFailed = () => {
  error("Validation Error", "Please fill in all required fields correctly");
};
</script>

<style scoped>
:deep(.ant-input) {
  background-color: #f1f4f9;
  border: 1px solid #d8d8d8;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  padding: 16px;
  color: #202224;
  font-family: "Nunito Sans", sans-serif;
  letter-spacing: -0.0643px;
  line-height: 25px;
}

:deep(.ant-input::placeholder) {
  color: #a6a6a6;
  opacity: 1;
  font-weight: 600;
}

:deep(.ant-input:focus),
:deep(.ant-input-focused) {
  border-color: #4880ff;
  box-shadow: 0 0 0 2px rgba(72, 128, 255, 0.1);
  background-color: #f1f4f9;
}

:deep(.ant-input-password) {
  background-color: #f1f4f9;
  border: 1px solid #d8d8d8;
  border-radius: 8px;
  height: 56px;
}

:deep(.ant-input-password .ant-input) {
  background-color: transparent;
  border: none;
  padding: 16px;
  height: 100%;
}

:deep(.ant-input-password .ant-input-password-icon) {
  color: #202224;
  opacity: 0.6;
  margin-right: 16px;
}

:deep(.ant-checkbox) {
  border-radius: 6px;
}

:deep(.ant-btn-primary) {
  background: #4880ff;
  border: none;
  box-shadow: none;
  font-family: "Nunito Sans", sans-serif;
  height: 56px;
}

:deep(.ant-btn-primary:hover),
:deep(.ant-btn-primary:focus) {
  background: #3a6fcc;
  border: none;
}

:deep(.ant-btn-link) {
  padding: 0;
  height: auto;
  font-family: "Nunito Sans", sans-serif;
}

h1,
p,
label,
span {
  font-family: "Nunito Sans", sans-serif;
}
</style>
