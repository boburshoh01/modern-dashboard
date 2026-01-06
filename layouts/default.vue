<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <TheSidebar />

    <!-- Main Content -->
    <div
      class="transition-all duration-300"
      :class="[sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64']"
    >
      <!-- Header -->
      <TheHeader />

      <!-- Page Content -->
      <main class="p-4 lg:p-6">
        <!-- Breadcrumbs -->
        <TheBreadcrumbs class="mb-4" />

        <!-- Page Slot -->
        <slot />
      </main>
    </div>

    <!-- Mobile Overlay -->
    <div
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-30 bg-black/50 lg:hidden"
      @click="closeMobileMenu"
    />
  </div>
</template>

<script setup lang="ts">
const themeStore = useThemeStore()
const { sidebarCollapsed } = storeToRefs(themeStore)

const mobileMenuOpen = ref(false)

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// Initialize theme on mount
onMounted(() => {
  themeStore.initTheme()
})
</script>
