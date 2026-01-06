<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 dark:from-gray-800 dark:to-gray-900 p-4"
  >
    <!-- Language Switcher -->
    <div class="absolute top-4 right-4 flex items-center gap-2">
      <LanguageSwitcher />
      <ThemeToggle />
    </div>

    <!-- Auth Container -->
    <div class="w-full max-w-md">
      <div class="card p-8">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4"
          >
            <svg
              class="w-8 h-8 text-primary-600 dark:text-primary-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Modern Dashboard
          </h1>
        </div>

        <!-- Slot -->
        <slot />
      </div>

      <!-- Footer -->
      <p class="text-center text-white/70 text-sm mt-6">
        &copy; {{ currentYear }} Modern Dashboard. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const themeStore = useThemeStore()

const currentYear = computed(() => new Date().getFullYear())

onMounted(() => {
  themeStore.initTheme()
})
</script>
