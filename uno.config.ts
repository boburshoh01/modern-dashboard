import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss"

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      cdn: "https://esm.sh/",
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    colors: {
      primary: {
        50: "#eef2ff",
        100: "#e0e7ff",
        200: "#c7d2fe",
        300: "#a5b4fc",
        400: "#818cf8",
        500: "#4880ff", // Main Brand Color
        600: "#3a6fcc", // Hover
        700: "#2c5ab3", // Active
        800: "#1e40af",
        900: "#1e3a8a",
        950: "#172554",
      },
      // Keep existing dark theme
      dark: {
        main: "#1b2431",
        card: "#273142",
        search: "#323d4e",
        border: "#313d4f",
        text: {
          primary: "#ffffff",
          secondary: "#8a99af",
        },
      },
      // Add semantic mappings if needed, or just use primary-500
      background: "#f5f6fa",
      surface: "#ffffff",
    },
  },
  shortcuts: [
    ["btn-primary", "bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg transition-colors"],
    ["card-base", "bg-surface dark:bg-dark-card rounded-2xl shadow-sm"],
  ],
  rules: [],
})
