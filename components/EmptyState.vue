<template>
  <div class="py-12 text-center">
    <div
      class="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
      :class="iconBgClass"
    >
      <slot name="icon">
        <svg class="w-8 h-8" :class="iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </slot>
    </div>

    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      {{ title }}
    </h3>

    <p class="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
      {{ description }}
    </p>

    <slot name="action">
      <a-button v-if="actionText" type="primary" @click="$emit('action')">
        {{ actionText }}
      </a-button>
    </slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  actionText?: string
  type?: 'default' | 'search' | 'error'
}

const props = withDefaults(defineProps<Props>(), {
  title: 'No data',
  description: 'There is no data to display at the moment.',
  actionText: undefined,
  type: 'default'
})

defineEmits<{
  (e: 'action'): void
}>()

const iconBgClass = computed(() => {
  const classes = {
    default: 'bg-gray-100 dark:bg-gray-700',
    search: 'bg-primary-100 dark:bg-primary-900/30',
    error: 'bg-error-100 dark:bg-error-900/30'
  }
  return classes[props.type]
})

const iconClass = computed(() => {
  const classes = {
    default: 'text-gray-400 dark:text-gray-500',
    search: 'text-primary-500',
    error: 'text-error-500'
  }
  return classes[props.type]
})
</script>
