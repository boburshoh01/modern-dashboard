<template>
  <a-dropdown :trigger="['click']">
    <button class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
      <span class="text-lg">{{ currentFlag }}</span>
      <span class="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ currentLocaleName }}
      </span>
      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <template #overlay>
      <a-menu @click="handleMenuClick">
        <a-menu-item
          v-for="locale in availableLocales"
          :key="locale.code"
          :class="{ 'bg-primary-50 dark:bg-primary-900/20': locale.code === currentLocale }"
        >
          <div class="flex items-center gap-3">
            <span class="text-lg">{{ locale.flag }}</span>
            <span>{{ locale.name }}</span>
            <svg
              v-if="locale.code === currentLocale"
              class="w-4 h-4 ml-auto text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()

interface LocaleOption {
  code: string
  name: string
  flag: string
}

const availableLocales: LocaleOption[] = [
  { code: 'uz', name: "O'zbekcha", flag: '🇺🇿' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
]

const currentLocale = computed(() => locale.value)

const currentLocaleName = computed(() => {
  const current = availableLocales.find((l) => l.code === locale.value)
  return current?.name || 'Language'
})

const currentFlag = computed(() => {
  const current = availableLocales.find((l) => l.code === locale.value)
  return current?.flag || '🌐'
})

const handleMenuClick = (info: { key: string }) => {
  setLocale(info.key)
}
</script>
