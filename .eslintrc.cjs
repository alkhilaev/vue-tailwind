/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  env: {
    node: true,
    browser: true,
    "cypress/globals": true,
    es6: true,
  },
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  "extends": [
    "plugin:cypress/recommended",
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier"
  ],
  plugins: [
    "vue",
    "cypress"
  ],
  rules: {
    "vue/multi-word-component-names": "off",
    "vue/no-textarea-mustache": "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
        printWidth: 110,
      },
    ]
  }
}
