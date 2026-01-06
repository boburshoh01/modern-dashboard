<template>
  <aside
    class="fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700"
    :class="[
      sidebarCollapsed ? 'w-20' : 'w-64',
      mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
      <div v-if="!sidebarCollapsed" class="flex items-center gap-3">
        <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-500 flex-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span class="text-lg font-semibold text-gray-900 dark:text-white">Dashboard</span>
      </div>
      <div v-else class="w-full flex-center">
        <div class="w-8 h-8 rounded-lg bg-primary-500 flex-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.key"
        :to="item.path"
        class="sidebar-item"
        :class="{ 'sidebar-item-active': isActive(item.path) }"
      >
        <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
        <span v-if="!sidebarCollapsed" class="truncate">{{ $t(item.label) }}</span>
      </NuxtLink>
    </nav>

    <!-- Collapse Toggle -->
    <button
      class="absolute bottom-4 right-0 translate-x-1/2 p-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 hidden lg:flex"
      @click="toggleSidebar"
    >
      <svg
        class="w-4 h-4 text-gray-500 transition-transform"
        :class="{ 'rotate-180': sidebarCollapsed }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  </aside>
</template>

<script setup lang="ts">
import {
  HomeOutlined,
  ShoppingOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined
} from '@ant-design/icons-vue'

const route = useRoute()
const themeStore = useThemeStore()
const { sidebarCollapsed } = storeToRefs(themeStore)

const mobileOpen = ref(false)

const menuItems = [
  { key: 'dashboard', label: 'nav.dashboard', path: '/', icon: HomeOutlined },
  { key: 'products', label: 'nav.products', path: '/products', icon: ShoppingOutlined },
  { key: 'users', label: 'nav.users', path: '/users', icon: UserOutlined },
  { key: 'posts', label: 'nav.posts', path: '/posts', icon: FileTextOutlined },
  { key: 'settings', label: 'nav.settings', path: '/settings', icon: SettingOutlined }
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const toggleSidebar = () => {
  themeStore.toggleSidebar()
}
</script>
