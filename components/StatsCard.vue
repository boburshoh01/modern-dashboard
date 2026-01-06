<template>
  <div class="card p-6 card-hover">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
          {{ title }}
        </p>
        <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
          {{ formattedValue }}
        </p>
        <div v-if="change !== undefined" class="flex items-center mt-2 text-sm">
          <span
            class="flex items-center"
            :class="changeIsPositive ? 'text-success-500' : 'text-error-500'"
          >
            <svg
              class="w-4 h-4 mr-1"
              :class="{ 'rotate-180': !changeIsPositive }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {{ Math.abs(change) }}%
          </span>
          <span class="ml-2 text-gray-500 dark:text-gray-400">
            {{ changeLabel || 'vs last month' }}
          </span>
        </div>
      </div>
      <div
        class="flex-shrink-0 p-3 rounded-full"
        :class="iconBgClass"
      >
        <component :is="icon" class="w-6 h-6" :class="iconClass" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  title: string
  value: number | string
  icon: Component
  change?: number
  changeLabel?: string
  type?: 'primary' | 'success' | 'warning' | 'error'
  prefix?: string
  suffix?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  change: undefined,
  changeLabel: undefined,
  prefix: undefined,
  suffix: undefined
})

const formattedValue = computed(() => {
  let formatted = props.value
  if (typeof props.value === 'number') {
    formatted = new Intl.NumberFormat().format(props.value)
  }
  if (props.prefix) {
    formatted = props.prefix + formatted
  }
  if (props.suffix) {
    formatted = formatted + props.suffix
  }
  return formatted
})

const changeIsPositive = computed(() => (props.change ?? 0) >= 0)

const iconBgClass = computed(() => {
  const classes = {
    primary: 'bg-primary-100 dark:bg-primary-900/30',
    success: 'bg-success-100 dark:bg-success-900/30',
    warning: 'bg-warning-100 dark:bg-warning-900/30',
    error: 'bg-error-100 dark:bg-error-900/30'
  }
  return classes[props.type]
})

const iconClass = computed(() => {
  const classes = {
    primary: 'text-primary-600 dark:text-primary-400',
    success: 'text-success-600 dark:text-success-400',
    warning: 'text-warning-600 dark:text-warning-400',
    error: 'text-error-600 dark:text-error-400'
  }
  return classes[props.type]
})
</script>
