<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
    <div class="text-center max-w-md">
      <!-- Error Icon -->
      <div
        class="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
        :class="errorIconBg"
      >
        <span class="text-5xl font-bold" :class="errorIconColor">
          {{ errorCode }}
        </span>
      </div>

      <!-- Error Title -->
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ errorTitle }}
      </h1>

      <!-- Error Description -->
      <p class="text-gray-500 dark:text-gray-400 mb-8">
        {{ errorDescription }}
      </p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a-button type="primary" size="large" @click="goHome">
          {{ $t('errors.goHome') }}
        </a-button>
        <a-button size="large" @click="goBack">
          {{ $t('common.back') }}
        </a-button>
      </div>

      <!-- Error Details (Dev Mode) -->
      <div v-if="isDev && error?.message" class="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
        <p class="text-sm text-gray-600 dark:text-gray-400 font-mono">
          {{ error.message }}
        </p>
        <pre v-if="error.stack" class="mt-2 text-xs text-gray-500 overflow-auto">{{ error.stack }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

interface Props {
  error: NuxtError
}

const props = defineProps<Props>()
const { t } = useI18n()

const isDev = process.dev

const errorCode = computed(() => {
  return props.error?.statusCode || 500
})

const errorTitle = computed(() => {
  const titles: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: t('errors.403.title'),
    404: t('errors.404.title'),
    500: t('errors.500.title')
  }
  return titles[errorCode.value] || t('errors.500.title')
})

const errorDescription = computed(() => {
  const descriptions: Record<number, string> = {
    400: 'The request could not be understood by the server.',
    401: 'You need to be logged in to access this page.',
    403: t('errors.403.description'),
    404: t('errors.404.description'),
    500: t('errors.500.description')
  }
  return descriptions[errorCode.value] || t('errors.500.description')
})

const errorIconBg = computed(() => {
  if (errorCode.value === 404) {
    return 'bg-warning-100 dark:bg-warning-900/30'
  }
  if (errorCode.value === 403) {
    return 'bg-error-100 dark:bg-error-900/30'
  }
  return 'bg-error-100 dark:bg-error-900/30'
})

const errorIconColor = computed(() => {
  if (errorCode.value === 404) {
    return 'text-warning-500'
  }
  return 'text-error-500'
})

const goHome = () => {
  clearError({ redirect: '/' })
}

const goBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    clearError({ redirect: '/' })
  }
}
</script>
