import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Antd from 'ant-design-vue'
import i18n from './i18n'
import router from './router'
import 'ant-design-vue/dist/reset.css'
import 'virtual:uno.css'
import '@/assets/css/main.css'
import App from './App.vue'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(Antd)

app.mount('#app')
