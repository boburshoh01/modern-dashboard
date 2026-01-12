import { defineStore } from 'pinia'

export type ThemeMode = 'light' | 'dark' | 'system'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    mode: 'system' as ThemeMode,
    isDark: false,
  }),

  getters: {
    currentMode: (state) => state.mode,
    isDarkMode: (state) => state.isDark,
  },

  actions: {
    setMode(mode: ThemeMode) {
      this.mode = mode
      this.applyTheme()
    },

    toggleTheme() {
      if (this.mode === 'system') {
        this.mode = 'light'
      } else if (this.mode === 'light') {
        this.mode = 'dark'
      } else {
        this.mode = 'system'
      }
      this.applyTheme()
    },

    applyTheme() {
      if (typeof window === 'undefined') return

      let isDark = false

      if (this.mode === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      } else {
        isDark = this.mode === 'dark'
      }

      this.isDark = isDark

      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },

    initTheme() {
      this.applyTheme()

      if (typeof window !== 'undefined') {
        window.matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', () => {
            if (this.mode === 'system') {
              this.applyTheme()
            }
          })
      }
    },
  },

  persist: {
    key: 'theme',
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    paths: ['mode'],
  },
})
