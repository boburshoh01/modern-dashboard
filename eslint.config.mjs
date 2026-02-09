import antfu from "@antfu/eslint-config"

export default antfu({
  vue: true,
  typescript: true,
  markdown: false,
  yaml: true,

  stylistic: {
    indent: 2,
    quotes: "double",
    semi: false,
  },

  rules: {
    // Brace style
    "style/brace-style": ["error", "1tbs", { allowSingleLine: true }],
    "style/no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
    "style/padded-blocks": ["error", "never"],
    "style/space-before-function-paren": ["error", { anonymous: "always", named: "never", asyncArrow: "always" }],

    // TypeScript
    "style/member-delimiter-style": ["error", {
      multiline: { delimiter: "none" },
      singleline: { delimiter: "semi", requireLast: false },
    }],

    // Vue template formatting
    "vue/max-attributes-per-line": ["error", { singleline: 3, multiline: 1 }],
    "vue/html-self-closing": ["error", { html: { void: "always", normal: "never", component: "always" }, svg: "always", math: "always" }],

    // Ignore underscore prefixed vars
    "unused-imports/no-unused-vars": ["error", {
      vars: "all",
      varsIgnorePattern: "^_",
      args: "after-used",
      argsIgnorePattern: "^_",
      caughtErrorsIgnorePattern: "^_",
    }],
  },
})
