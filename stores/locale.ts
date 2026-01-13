import { defineStore } from 'pinia'

export type LocaleCode = 'en' | 'uz' | 'ru'

export interface LocaleOption {
  code: LocaleCode
  name: string
  flag: string
}

export const localeOptions: LocaleOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'uz', name: 'O\'zbek', flag: '🇺🇿' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
]

export const useLocaleStore = defineStore('locale', {
  state: () => ({
    currentLocale: 'en' as LocaleCode,
    availableLocales: localeOptions,
  }),

  getters: {
    locale: (state) => state.currentLocale,
    locales: (state) => state.availableLocales,
    currentLocaleOption: (state) => {
      return state.availableLocales.find(l => l.code === state.currentLocale)
    },
  },

  actions: {
    setLocale(locale: LocaleCode) {
      if (this.availableLocales.some(l => l.code === locale)) {
        this.currentLocale = locale

        if (typeof window !== 'undefined') {
          const nuxtApp = useNuxtApp()
          if (nuxtApp.$i18n) {
            nuxtApp.$i18n.setLocale(locale)
          }
        }
      }
    },

    initLocale() {
      if (typeof window !== 'undefined') {
        const nuxtApp = useNuxtApp()
        if (nuxtApp.$i18n) {
          const i18nLocale = nuxtApp.$i18n.locale.value as LocaleCode
          if (i18nLocale !== this.currentLocale) {
            nuxtApp.$i18n.setLocale(this.currentLocale)
          }
        }
      }
    },
  },

  persist: {
    key: 'locale',
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    paths: ['currentLocale'],
  },
})
