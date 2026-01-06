import { defineStore } from 'pinia'
import type { ThemeMode } from '~/types'

interface ThemeState {
  mode: ThemeMode
  sidebarCollapsed: boolean
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    mode: 'light',
    sidebarCollapsed: false
  }),

  getters: {
    isDark: (state) => {
      if (state.mode === 'system') {
        if (import.meta.client) {
          return window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        return false
      }
      return state.mode === 'dark'
    },
    currentMode: (state) => state.mode,
    isSidebarCollapsed: (state) => state.sidebarCollapsed
  },

  actions: {
    setMode(mode: ThemeMode) {
      this.mode = mode
      this.applyTheme()
    },

    toggleMode() {
      if (this.mode === 'light') {
        this.mode = 'dark'
      } else if (this.mode === 'dark') {
        this.mode = 'system'
      } else {
        this.mode = 'light'
      }
      this.applyTheme()
    },

    toggleDarkMode() {
      this.mode = this.mode === 'dark' ? 'light' : 'dark'
      this.applyTheme()
    },

    applyTheme() {
      if (import.meta.client) {
        const isDark = this.isDark
        document.documentElement.classList.toggle('dark', isDark)

        // Update meta theme-color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]')
        if (metaThemeColor) {
          metaThemeColor.setAttribute('content', isDark ? '#111827' : '#ffffff')
        }
      }
    },

    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    setSidebarCollapsed(collapsed: boolean) {
      this.sidebarCollapsed = collapsed
    },

    initTheme() {
      this.applyTheme()

      // Listen for system theme changes
      if (import.meta.client && this.mode === 'system') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        mediaQuery.addEventListener('change', () => {
          if (this.mode === 'system') {
            this.applyTheme()
          }
        })
      }
    }
  },

  persist: {
    key: 'theme',
    pick: ['mode', 'sidebarCollapsed']
  }
})
