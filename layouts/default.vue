<script setup lang="ts">
import { theme } from "ant-design-vue"
import { useNotification } from "~/composables/useNotification"
import { useAuthStore } from "~/stores/auth"

const authStore = useAuthStore()
const { success, error } = useNotification()
const router = useRouter()
const colorMode = useColorMode()

const sidebarOpen = ref(true)
const isMiniSidebar = ref(false)
const searchQuery = ref("")
const windowWidth = ref(
  typeof window !== "undefined" ? window.innerWidth : 1200,
)

const activeThemeAlgorithm = computed(() => {
  return colorMode.value === "dark"
    ? theme.darkAlgorithm
    : theme.defaultAlgorithm
})

function toggleTheme() {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark"
}

function toggleSidebar() {
  if (import.meta.client && window.innerWidth >= 1024) {
    isMiniSidebar.value = !isMiniSidebar.value
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarMini", JSON.stringify(isMiniSidebar.value))
    }
  } else {
    sidebarOpen.value = !sidebarOpen.value
  }
}

async function handleLogout() {
  try {
    await authStore.logout()
    success("Logged Out", "You have been successfully logged out")
    router.push("/login")
  } catch {
    error("Logout Error", "An error occurred during logout")
  }
}

function handleResize() {
  if (typeof window === "undefined")
    return
  windowWidth.value = window.innerWidth
  const isMobile = windowWidth.value < 1024

  if (isMobile) {
    sidebarOpen.value = false
    isMiniSidebar.value = false
  } else {
    sidebarOpen.value = true
    const savedMiniState = localStorage.getItem("sidebarMini")
    if (savedMiniState !== null) {
      isMiniSidebar.value = JSON.parse(savedMiniState)
    }
  }
}

onMounted(() => {
  if (typeof window !== "undefined") {
    const savedMiniState = localStorage.getItem("sidebarMini")
    if (savedMiniState !== null) {
      isMiniSidebar.value = JSON.parse(savedMiniState)
    }

    if (window.innerWidth < 1024) {
      sidebarOpen.value = false
    } else {
      sidebarOpen.value = true
    }
    window.addEventListener("resize", handleResize)
  }
})

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", handleResize)
  }
})
</script>

<template>
  <a-config-provider
    :theme="{
      algorithm: activeThemeAlgorithm,
      token: { fontFamily: 'Nunito Sans', colorPrimary: '#4880ff' },
    }"
  >
    <div
      class="min-h-screen bg-background dark:bg-dark-main flex relative transition-colors duration-300"
    >
      <!-- Mobile overlay -->
      <div
        v-if="sidebarOpen && windowWidth < 1024"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[45] lg:hidden transition-opacity"
        @click="sidebarOpen = false"
      />

      <!-- Sidebar -->
      <AppSidebar
        :sidebar-open="sidebarOpen"
        :is-mini-sidebar="isMiniSidebar"
        :window-width="windowWidth"
        @close="sidebarOpen = false"
        @logout="handleLogout"
      />

      <!-- Main content -->
      <div
        class="flex-1 flex flex-col min-h-screen transition-all duration-300 min-w-0"
        :class="[
          sidebarOpen ? (isMiniSidebar ? 'lg:ml-20' : 'lg:ml-64') : '',
          !sidebarOpen && 'lg:ml-0',
        ]"
      >
        <!-- Header -->
        <AppHeader
          :search-query="searchQuery"
          @toggle-sidebar="toggleSidebar"
          @toggle-theme="toggleTheme"
          @logout="handleLogout"
          @update:search-query="searchQuery = $event"
        />

        <main
          class="flex-1 p-4 sm:p-6 lg:p-8 bg-background dark:bg-dark-main transition-colors duration-300"
        >
          <div class="mb-6">
            <AppBreadcrumbs />
          </div>
          <slot></slot>
        </main>
      </div>
    </div>
  </a-config-provider>
</template>

<style>
.dark .ant-form-item-label > label {
  color: #ffffff !important;
}

.dark .ant-input,
.dark .ant-input-number,
.dark .ant-select-selector,
.dark .ant-picker {
  background-color: #1b2431 !important;
  border-color: #313d4f !important;
  color: #ffffff !important;
}

.dark .ant-input:focus,
.dark .ant-input-number:focus,
.dark .ant-select-selector:focus,
.dark .ant-picker:focus {
  border-color: #4880ff !important;
}

.dark .ant-divider-inner-text {
  color: #ffffff !important;
}

.dark .ant-divider-horizontal {
  border-block-start-color: #313d4f !important;
}

.search-input.ant-input-affix-wrapper {
  background-color: #f5f6fa !important;
  border: 1px solid #d5d5d5 !important;
  border-radius: 999px !important;
  height: 38px !important;
  transition: all 0.3s ease !important;
  display: flex !important;
  align-items: center !important;
  padding-left: 12px !important;
  padding-right: 12px !important;
}

.dark .search-input.ant-input-affix-wrapper {
  background-color: #323d4e !important;
  border-color: #313d4f !important;
}

.search-input .ant-input,
.header-search.ant-input {
  background-color: transparent !important;
  box-shadow: none !important;
  height: 100% !important;
  padding: 0 8px !important;
}

.dark .search-input .ant-input,
.dark .header-search.ant-input {
  background-color: transparent !important;
  color: #ffffff !important;
}
</style>

<style scoped>
aside {
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 1024px) {
  aside {
    box-shadow: 10px 0 15px -3px rgba(0, 0, 0, 0.1),
      4px 0 6px -2px rgba(0, 0, 0, 0.05);
  }
}

:deep(.ant-input) {
  font-family: "Nunito Sans", sans-serif;
}

:deep(.ant-dropdown-menu) {
  @apply dark:bg-dark-card dark:border-dark-border;
}

:deep(.ant-dropdown-menu-item:hover) {
  @apply dark:bg-dark-main;
}
</style>
