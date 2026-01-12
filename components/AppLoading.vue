<template>
  <div
    v-if="type === 'full'"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 dark:bg-dark-main/80 backdrop-blur-sm"
  >
    <div class="flex flex-col items-center gap-4">
      <div
        class="w-12 h-12 border-4 border-[#4880ff] border-t-transparent rounded-full animate-spin"
      />
      <p class="text-sm font-bold text-[#4880ff] animate-pulse">
        {{ label || t("common.loading", "Loading...") }}
      </p>
    </div>
  </div>

  <div
    v-else-if="type === 'card'"
    class="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm"
  >
    <a-skeleton active :paragraph="{ rows: 3 }" />
  </div>

  <div v-else-if="type === 'table'" class="space-y-4">
    <div class="flex justify-between items-center mb-6">
      <a-skeleton-button active size="large" class="w-32" />
      <a-skeleton-button active size="large" class="w-24" />
    </div>
    <div
      v-for="i in 5"
      :key="i"
      class="border-b border-gray-100 dark:border-dark-border py-4"
    >
      <a-skeleton active :paragraph="{ rows: 1 }" avatar />
    </div>
  </div>

  <div v-else class="flex items-center justify-center p-8">
    <a-spin size="large" />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

defineProps<{
  type?: "full" | "card" | "table" | "spinner";
  label?: string;
}>();
</script>
