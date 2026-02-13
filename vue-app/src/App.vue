<script setup lang="ts">
import DefaultLayout from '@/layouts/default.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const layout = computed(() => {
  return route.meta.layout || DefaultLayout
})
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<style>
/* Global resets or overrides if needed */
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
