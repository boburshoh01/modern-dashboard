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
        50: "#f0f9ff",
        100: "#e0f2fe",
        200: "#bae6fd",
        300: "#7dd3fc",
        400: "#38bdf8",
        500: "#0ea5e9",
        600: "#0284c7",
        700: "#0369a1",
        800: "#075985",
        900: "#0c4a6e",
        950: "#082f49",
      },
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
    },
  },
  shortcuts: [
    ["btn-primary", "bg-[#4880ff] hover:bg-[#3a6fcc] text-white font-bold rounded-lg transition-colors"],
    ["card-base", "bg-white dark:bg-dark-card rounded-2xl shadow-sm"],
  ],
  rules: [],
})
