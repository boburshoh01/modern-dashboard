// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt({
  rules: {
    "no-console": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "vue/no-unused-components": "warn",
    "vue/multi-word-component-names": "off",
    "vue/require-default-prop": "off",
    "vue/html-self-closing": [
      "warn",
      {
        html: {
          void: "always",
          normal: "never",
          component: "always",
        },
      },
    ],
  },
})
