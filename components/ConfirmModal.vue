<template>
  <a-modal
    v-model:open="visible"
    :title="title"
    :confirm-loading="loading"
    :ok-text="confirmText"
    :cancel-text="cancelText"
    :ok-button-props="{ danger: type === 'danger' }"
    @ok="handleConfirm"
    @cancel="handleCancel"
  >
    <div class="py-4">
      <div class="flex items-start gap-4">
        <!-- Icon -->
        <div
          class="flex-shrink-0 w-10 h-10 rounded-full flex-center"
          :class="iconBgClass"
        >
          <svg
            v-if="type === 'danger'"
            class="w-6 h-6 text-error-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <svg
            v-else-if="type === 'warning'"
            class="w-6 h-6 text-warning-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            v-else
            class="w-6 h-6 text-primary-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <!-- Content -->
        <div class="flex-1">
          <p class="text-gray-700 dark:text-gray-300">{{ message }}</p>
          <slot />
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message?: string
  type?: 'info' | 'warning' | 'danger'
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm',
  message: 'Are you sure you want to proceed?',
  type: 'info',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  loading: false
})

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const visible = defineModel<boolean>({ default: false })

const iconBgClass = computed(() => {
  const classes = {
    info: 'bg-primary-100 dark:bg-primary-900/30',
    warning: 'bg-warning-100 dark:bg-warning-900/30',
    danger: 'bg-error-100 dark:bg-error-900/30'
  }
  return classes[props.type]
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  visible.value = false
}
</script>
