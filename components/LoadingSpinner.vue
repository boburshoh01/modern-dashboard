<template>
  <div
    class="flex items-center justify-center"
    :class="[fullScreen ? 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 z-50' : '']"
  >
    <div class="text-center">
      <a-spin :size="size" :tip="tip" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'small' | 'default' | 'large'
  tip?: string
  fullScreen?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'default',
  tip: undefined,
  fullScreen: false
})
</script>
