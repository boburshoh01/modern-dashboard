<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Initialize theme on app mount
const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})

// Set page title
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Modern Dashboard` : 'Modern Dashboard'
  }
})
</script>
