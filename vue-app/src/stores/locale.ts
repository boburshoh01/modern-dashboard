import { defineStore } from "pinia"
import { ref, computed } from "vue"
import i18n from "@/i18n"

export type LocaleCode = "en" | "uz" | "ru"

export interface LocaleOption {
  code: LocaleCode
  name: string
  flag: string
}

export const localeOptions: LocaleOption[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "uz", name: "O'zbek", flag: "🇺🇿" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
]

export const useLocaleStore = defineStore("locale", () => {
  const currentLocale = ref<LocaleCode>("en")
  const availableLocales = ref<LocaleOption[]>(localeOptions)

  const locale = computed(() => currentLocale.value)
  const locales = computed(() => availableLocales.value)
  const currentLocaleOption = computed(() =>
    availableLocales.value.find(l => l.code === currentLocale.value)
  )

  function setLocale(newLocale: LocaleCode) {
    if (availableLocales.value.some(l => l.code === newLocale)) {
      currentLocale.value = newLocale

      // Update i18n instance
      if (i18n.global) {
        // @ts-ignore
        i18n.global.locale.value = newLocale
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("locale", newLocale)
      }
    }
  }

  function initLocale() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("locale") as LocaleCode
      if (stored && availableLocales.value.some(l => l.code === stored)) {
        setLocale(stored)
      }
    }
  }

  return {
    currentLocale,
    availableLocales,
    locale,
    locales,
    currentLocaleOption,
    setLocale,
    initLocale
  }
}, {
  persist: {
    key: "locale",
    storage: localStorage,
    pick: ["currentLocale"],
  },
})
