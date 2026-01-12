<template>
  <div
    class="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-dashed border-gray-200 dark:border-dark-border"
  >
    <div class="mb-6 relative">
      <div
        class="absolute -inset-4 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-2xl opacity-50 animate-pulse"
      />
      <div class="relative text-6xl opacity-80">
        <slot name="image">
          <InboxOutlined class="text-gray-300 dark:text-dark-border" />
        </slot>
      </div>
    </div>
    <h3 class="text-xl font-bold text-[#202224] dark:text-white mb-2">
      {{ title || "No Data Found" }}
    </h3>
    <p class="text-gray-400 dark:text-dark-text-secondary max-w-xs mb-8">
      {{
        description ||
        "We couldn't find any results. Try adjusting your filters or adding new items."
      }}
    </p>
    <slot name="extra">
      <a-button
        v-if="actionLabel"
        type="primary"
        class="rounded-xl h-11 px-8 font-bold border-none shadow-lg shadow-blue-500/20"
        @click="$emit('action')"
      >
        {{ actionLabel }}
      </a-button>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { InboxOutlined } from "@ant-design/icons-vue";

defineProps<{
  title?: string;
  description?: string;
  actionLabel?: string;
}>();

defineEmits(["action"]);
</script>
