// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@nuxt/eslint'
  ],

  css: ['~/assets/css/main.css'],

  // i18n configuration
  i18n: {
    locales: [
      { code: 'uz', name: "O'zbekcha", file: 'uz.json' },
      { code: 'ru', name: 'Русский', file: 'ru.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ],
    defaultLocale: 'uz',
    lazy: true,
    langDir: 'locales/',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root'
    }
  },

  // Tailwind CSS configuration
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.ts'
  },

  // Runtime config for API
  runtimeConfig: {
    public: {
      apiBase: 'https://dummyjson.com'
    }
  },

  // App configuration
  app: {
    head: {
      title: 'Modern Dashboard',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Modern Admin Dashboard with Nuxt 3' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true
  },

  // Build configuration
  build: {
    transpile: ['ant-design-vue', '@ant-design/icons-vue']
  },

  // Vite configuration
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/css/variables.scss" as *;'
        }
      }
    }
  }
})
