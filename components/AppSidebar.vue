<script setup lang="ts">
import {
  AppstoreOutlined,
  CloseOutlined,
  DropboxOutlined,
  HeartOutlined,
  LogoutOutlined,
  TagsOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons-vue"
import type { Component } from "vue"

interface MenuItem {
  path: string
  icon?: Component
  label?: string
  labelKey: string
}

defineProps<{
  sidebarOpen: boolean
  isMiniSidebar: boolean
  windowWidth: number
}>()

const emit = defineEmits<{
  (e: "close" | "logout"): void
}>()

const route = useRoute()

const menuItems: MenuItem[] = [
  { path: "/dashboard", icon: AppstoreOutlined, labelKey: "sidebar.dashboard" },
]

const mainMenuItems: MenuItem[] = [
  { path: "/products", icon: DropboxOutlined, labelKey: "sidebar.products" },
  { path: "/favorites", icon: HeartOutlined, labelKey: "sidebar.favorites" },
  { path: "/users", icon: UsergroupAddOutlined, labelKey: "sidebar.users" },
  { path: "/categories", icon: TagsOutlined, labelKey: "sidebar.categories" },
  { path: "/brands", icon: AppstoreOutlined, labelKey: "sidebar.brands" },
  { path: "/countries", label: "C", labelKey: "sidebar.countries" },
  { path: "/organizations", label: "O", labelKey: "sidebar.organizations" },
]

function isActive(path: string): boolean {
  return route.path === path || route.path.startsWith(path + "/")
}
</script>

<template>
  <aside
    class="bg-white dark:bg-dark-card fixed left-0 top-0 h-full z-50 border-r border-gray-200 dark:border-dark-border overflow-y-auto transition-all duration-300"
    :class="[
      sidebarOpen ? (isMiniSidebar ? 'w-20' : 'w-64') : '-translate-x-full',
      !sidebarOpen && 'lg:translate-x-0',
    ]"
  >
    <div
      class="p-6 border-b border-gray-200 dark:border-dark-border flex items-center justify-between"
      :class="[isMiniSidebar ? 'justify-center' : '']"
    >
      <div class="flex items-center">
        <h1
          v-if="!isMiniSidebar"
          class="text-xl font-extrabold flex items-center gap-2"
        >
          <span class="text-primary-500 text-xl">Made In</span>
          <span class="text-gray-900 dark:text-white text-xl">Uzbekistan</span>
        </h1>
        <span v-else class="text-primary-500 text-2xl font-extrabold">M</span>
      </div>

      <button
        v-if="windowWidth < 1024"
        class="p-2 -mr-2 text-gray-400 hover:text-primary-500 transition-colors"
        @click="emit('close')"
      >
        <CloseOutlined class="text-xl" />
      </button>
    </div>

    <nav
      class="p-4 space-y-1 flex flex-col h-[calc(100%-97px)]"
      :class="[isMiniSidebar ? 'px-2' : 'p-4']"
    >
      <div class="flex-1">
        <!-- Dashboard -->
        <NuxtLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 py-3 rounded-lg font-semibold text-sm transition-colors"
          active-class="bg-primary-500 text-white"
          :class="[
            isMiniSidebar ? 'justify-center px-0' : 'px-4',
            isActive(item.path)
              ? ''
              : 'text-gray-900 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-main',
          ]"
        >
          <component :is="item.icon" v-if="item.icon" class="text-lg" />
          <span v-if="item.label && isMiniSidebar" class="text-lg">{{ item.label }}</span>
          <span v-if="!isMiniSidebar">{{ $t(item.labelKey) }}</span>
        </NuxtLink>

        <!-- Main section -->
        <div class="pt-4">
          <div
            v-if="!isMiniSidebar"
            class="px-4 py-2 text-xs font-bold text-gray-900 dark:text-dark-text-secondary opacity-60 tracking-wider uppercase"
          >
            {{ $t("sidebar.main") }}
          </div>

          <NuxtLink
            v-for="item in mainMenuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 py-3 rounded-lg font-semibold text-sm transition-colors"
            active-class="bg-primary-500 text-white"
            :class="[
              isMiniSidebar ? 'justify-center px-0' : 'px-4',
              isActive(item.path)
                ? ''
                : 'text-gray-900 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-main',
            ]"
          >
            <component :is="item.icon" v-if="item.icon" class="text-lg" />
            <template v-else>
              <span v-if="isMiniSidebar" class="text-lg">{{ item.label }}</span>
              <span v-else class="text-lg w-5">{{ item.label }}</span>
            </template>
            <span v-if="!isMiniSidebar">{{ $t(item.labelKey) }}</span>
          </NuxtLink>
        </div>
      </div>

      <div
        class="pt-4 border-t border-gray-200 dark:border-dark-border mt-auto"
      >
        <button
          class="w-full flex items-center gap-3 py-3 rounded-lg text-gray-900 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-main font-semibold text-sm cursor-pointer transition-colors"
          :class="[isMiniSidebar ? 'justify-center px-0' : 'px-4']"
          @click="emit('logout')"
        >
          <LogoutOutlined class="text-lg" />
          <span v-if="!isMiniSidebar">{{ $t("sidebar.logout") }}</span>
        </button>
      </div>
    </nav>
  </aside>
</template>
