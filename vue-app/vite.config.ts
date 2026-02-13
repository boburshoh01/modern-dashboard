import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
        {
          'vue-i18n': [
            'useI18n'
          ]
        }
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/composables',
        'src/stores'
      ],
      vueTemplate: true,
    }),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
