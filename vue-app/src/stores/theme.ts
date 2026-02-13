import { defineStore } from "pinia"
import { ref, computed } from "vue"

export type ThemeMode = "light" | "dark" | "system"

export const useThemeStore = defineStore("theme", () => {
  const mode = ref<ThemeMode>("system")
  const isDark = ref(false)

  const currentMode = computed(() => mode.value)
  const isDarkMode = computed(() => isDark.value)

  function applyTheme() {
    if (typeof window === "undefined") return

    let shouldBeDark = false

    if (mode.value === "system") {
      shouldBeDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    } else {
      shouldBeDark = mode.value === "dark"
    }

    isDark.value = shouldBeDark

    if (shouldBeDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  function setMode(newMode: ThemeMode) {
    mode.value = newMode
    applyTheme()
  }

  function toggleTheme() {
    if (mode.value === "system") {
      mode.value = "light"
    } else if (mode.value === "light") {
      mode.value = "dark"
    } else {
      mode.value = "system"
    }
    applyTheme()
  }

  function initTheme() {
    applyTheme()

    if (typeof window !== "undefined") {
      window.matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", () => {
          if (mode.value === "system") {
            applyTheme()
          }
        })
    }
  }

  return {
    mode,
    isDark,
    currentMode,
    isDarkMode,
    setMode,
    toggleTheme,
    applyTheme,
    initTheme
  }
}, {
  persist: {
    key: "theme",
    storage: localStorage,
    pick: ["mode"]
  }
})
