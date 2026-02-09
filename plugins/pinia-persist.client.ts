import type { Pinia } from "pinia"
import { createPersistedState } from "pinia-plugin-persistedstate"

export default defineNuxtPlugin(({ $pinia }) => {
  if (typeof window !== "undefined" && window.localStorage) {
    const pinia = $pinia as Pinia
    pinia.use(
      createPersistedState({
        storage: localStorage,
      }),
    )
  }
})
