const js = require('@eslint/js')
const globals = require('globals')
const vue = require('eslint-plugin-vue')

module.exports = [
  {
    ignores: ['build/*.js', 'src/assets/**', 'public/**', 'dist/**', 'node_modules/**']
  },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['src/**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/attributes-order': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-indent': 'off',
      'vue/html-self-closing': 'off',
      'vue/no-v-html': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-v-model-argument': 'off',
      'vue/component-definition-name-casing': 'off',
      'vue/v-on-event-hyphenation': 'off',
      'vue/v-slot-style': 'off',
      'vue/require-default-prop': 'off',
      'no-console': 'off',
      'no-trailing-spaces': 'off',
      'no-unused-vars': 'off',
      'no-useless-escape': 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      semi: ['error', 'never'],
      'prefer-const': 'error'
    }
  }
]
