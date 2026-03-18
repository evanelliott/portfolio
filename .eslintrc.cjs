/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    // 1. Essential Vue 3 rules (prevents common template errors)
    'plugin:vue/vue3-recommended',
    // 2. Standard ESLint recommended rules
    'eslint:recommended',
    // 3. Strict TypeScript support
    '@vue/eslint-config-typescript',
    // 4. Prettier bridge (disables conflicting style rules)
    '@vue/eslint-config-prettier/skip-formatting',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    // Senior Grade: Prevent 'any' to maintain Data Integrity
    '@typescript-eslint/no-explicit-any': 'error',
    // Ensure consistent component naming (Multi-word)
    'vue/multi-word-component-names': 'warn',
    // Force specific order for Vue SFC blocks (Template -> Script -> Style)
    'vue/component-tags-order': [
      'error',
      {
        order: ['template', 'script', 'style'],
      },
    ],
    // Clean code: Remove unused imports automatically during 'npm run lint'
    'no-unused-vars': 'off', // Handled by TS config
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    // Console logs are for dev; warn for production readiness
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
}
