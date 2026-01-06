<template>
  <div>
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      {{ $t('auth.loginTitle') }}
    </h2>
    <p class="text-gray-500 dark:text-gray-400 mb-6">
      {{ $t('auth.loginSubtitle') }}
    </p>

    <!-- Error Alert -->
    <a-alert
      v-if="authStore.error"
      type="error"
      :message="authStore.error"
      class="mb-4"
      closable
      @close="authStore.clearError"
    />

    <!-- Login Form -->
    <a-form
      :model="formState"
      :rules="formRules"
      layout="vertical"
      @finish="handleSubmit"
    >
      <a-form-item :label="$t('auth.username')" name="username">
        <a-input
          v-model:value="formState.username"
          size="large"
          :placeholder="$t('auth.username')"
        >
          <template #prefix>
            <UserOutlined class="text-gray-400" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item :label="$t('auth.password')" name="password">
        <a-input-password
          v-model:value="formState.password"
          size="large"
          :placeholder="$t('auth.password')"
        >
          <template #prefix>
            <LockOutlined class="text-gray-400" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <div class="flex items-center justify-between">
          <a-checkbox v-model:checked="formState.remember">
            {{ $t('auth.rememberMe') }}
          </a-checkbox>
          <a class="text-primary-500 hover:text-primary-600">
            {{ $t('auth.forgotPassword') }}
          </a>
        </div>
      </a-form-item>

      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          size="large"
          block
          :loading="authStore.loading"
        >
          {{ $t('auth.login') }}
        </a-button>
      </a-form-item>
    </a-form>

    <!-- Test Credentials Info -->
    <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <p class="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">
        Test Credentials:
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Username: <code class="bg-gray-200 dark:bg-gray-600 px-1 rounded">michaelw</code>
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Password: <code class="bg-gray-200 dark:bg-gray-600 px-1 rounded">michaelwpass</code>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

const authStore = useAuthStore()
const { showSuccess } = useNotification()
const { t } = useI18n()

const formState = reactive({
  username: '',
  password: '',
  remember: false
})

const formRules = {
  username: [{ required: true, message: t('validation.required'), trigger: 'blur' }],
  password: [{ required: true, message: t('validation.required'), trigger: 'blur' }]
}

const handleSubmit = async () => {
  const result = await authStore.login({
    username: formState.username,
    password: formState.password
  })

  if (result.success) {
    showSuccess(t('auth.loginSuccess'))
    navigateTo('/')
  }
}
</script>
