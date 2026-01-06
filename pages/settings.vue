<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t('nav.settings') }}
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">
        Manage your preferences and settings
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Appearance Settings -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Appearance
        </h3>

        <div class="space-y-4">
          <!-- Theme -->
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ $t('theme.dark') }} Mode
              </p>
              <p class="text-sm text-gray-500">
                Toggle dark mode on or off
              </p>
            </div>
            <a-switch :checked="isDark" @change="toggleTheme" />
          </div>

          <!-- Sidebar -->
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">
                Collapsed Sidebar
              </p>
              <p class="text-sm text-gray-500">
                Show sidebar in collapsed mode
              </p>
            </div>
            <a-switch :checked="sidebarCollapsed" @change="toggleSidebar" />
          </div>
        </div>
      </div>

      <!-- Language Settings -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('language.title') }}
        </h3>

        <div class="space-y-4">
          <div
            v-for="lang in languages"
            :key="lang.code"
            class="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            :class="{ 'bg-primary-50 dark:bg-primary-900/20': locale === lang.code }"
            @click="setLocale(lang.code)"
          >
            <div class="flex items-center gap-3">
              <span class="text-2xl">{{ lang.flag }}</span>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ lang.name }}
              </span>
            </div>
            <svg
              v-if="locale === lang.code"
              class="w-5 h-5 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Account Settings -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Account
        </h3>

        <div class="space-y-4">
          <!-- User Info -->
          <div class="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <img
              :src="user?.image || 'https://via.placeholder.com/64'"
              :alt="userFullName"
              class="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ userFullName }}
              </p>
              <p class="text-sm text-gray-500">{{ user?.email }}</p>
            </div>
          </div>

          <!-- Actions -->
          <a-button block>
            Edit Profile
          </a-button>
          <a-button block>
            Change Password
          </a-button>
          <a-button block danger @click="handleLogout">
            {{ $t('auth.logout') }}
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { locale, setLocale } = useI18n()
const themeStore = useThemeStore()
const authStore = useAuthStore()

const { isDark, sidebarCollapsed } = storeToRefs(themeStore)
const { user, userFullName } = storeToRefs(authStore)

const languages = [
  { code: 'uz', name: "O'zbekcha", flag: '🇺🇿' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
]

const toggleTheme = () => {
  themeStore.toggleDarkMode()
}

const toggleSidebar = () => {
  themeStore.toggleSidebar()
}

const handleLogout = () => {
  authStore.logout()
}
</script>
