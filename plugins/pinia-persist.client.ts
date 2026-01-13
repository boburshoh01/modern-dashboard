import { createPersistedState } from 'pinia-plugin-persistedstate'
import type { Pinia } from 'pinia'

export default defineNuxtPlugin(({ $pinia }) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const pinia = $pinia as Pinia
    pinia.use(
      createPersistedState({
        storage: localStorage,
      })
    )
  }
})
