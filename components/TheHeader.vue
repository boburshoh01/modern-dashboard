<template>
  <header
    class="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-6 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
  >
    <!-- Left Side -->
    <div class="flex items-center gap-4">
      <!-- Mobile Menu Button -->
      <button
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
        @click="toggleMobileMenu"
      >
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Search -->
      <div class="hidden md:flex items-center">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('common.search') + '...'"
            class="w-64 pl-10 pr-4 py-2 text-sm bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Right Side -->
    <div class="flex items-center gap-2">
      <!-- Language Switcher -->
      <LanguageSwitcher />

      <!-- Theme Toggle -->
      <ThemeToggle />

      <!-- Notifications -->
      <a-dropdown :trigger="['click']">
        <button class="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span class="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full"></span>
        </button>
        <template #overlay>
          <a-menu class="w-72">
            <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <span class="font-semibold text-gray-900 dark:text-white">{{ $t('common.notifications') || 'Notifications' }}</span>
            </div>
            <a-menu-item v-for="i in 3" :key="i">
              <div class="flex items-start gap-3 py-2">
                <div class="w-8 h-8 rounded-full bg-primary-100 flex-center flex-shrink-0">
                  <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-900 dark:text-white truncate">New notification {{ i }}</p>
                  <p class="text-xs text-gray-500">{{ i }} hour ago</p>
                </div>
              </div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

      <!-- User Menu -->
      <a-dropdown :trigger="['click']">
        <button class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <img
            :src="user?.image || 'https://via.placeholder.com/32'"
            :alt="userFullName"
            class="w-8 h-8 rounded-full object-cover"
          />
          <span class="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ userFullName }}
          </span>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <template #overlay>
          <a-menu>
            <a-menu-item key="profile">
              <NuxtLink to="/profile" class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {{ $t('nav.profile') }}
              </NuxtLink>
            </a-menu-item>
            <a-menu-item key="settings">
              <NuxtLink to="/settings" class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ $t('nav.settings') }}
              </NuxtLink>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="logout" @click="handleLogout">
              <div class="flex items-center gap-2 text-error-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {{ $t('auth.logout') }}
              </div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { user, userFullName } = storeToRefs(authStore)

const searchQuery = ref('')

const emit = defineEmits<{
  (e: 'toggle-mobile-menu'): void
}>()

const toggleMobileMenu = () => {
  emit('toggle-mobile-menu')
}

const handleLogout = () => {
  authStore.logout()
}
</script>
