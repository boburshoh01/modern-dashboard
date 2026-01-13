<template>
  <div class="space-y-6">
    <p class="text-xs text-gray-400">Use these patterns for consistent forms</p>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
.ant-btn-primary {
  @apply h-11 px-6 rounded-xl font-bold border-none shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] !important;
}

.ant-input,
.ant-input-password,
.ant-input-affix-wrapper {
  @apply rounded-xl border-gray-200 dark:border-dark-border bg-[#f5f6fa] dark:bg-dark-main h-11 px-4 transition-all !important;
}

.ant-input:focus,
.ant-input-affix-wrapper-focused {
  @apply border-[#4880ff] ring-2 ring-blue-500/10 shadow-none !important;
}

.ant-select .ant-select-selector {
  @apply rounded-xl border-gray-200 dark:border-dark-border bg-[#f5f6fa] dark:bg-dark-main h-11 border-none py-1 transition-all !important;
}

.ant-select-focused .ant-select-selector {
  @apply border-[#4880ff] border-solid ring-2 ring-blue-500/10 shadow-none !important;
}

.ant-checkbox-inner {
  @apply rounded-md border-gray-300 dark:border-dark-border transition-all !important;
}

.ant-checkbox-checked .ant-checkbox-inner {
  @apply bg-[#4880ff] border-[#4880ff] !important;
}
</style>
