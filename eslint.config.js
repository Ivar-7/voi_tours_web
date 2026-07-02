import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // firebase_functions/ is a separate Node/TypeScript project with its own
  // ESLint setup (legacy .eslintrc.js, @typescript-eslint) — not part of
  // this Vite/React app's lint config. firebase_admin/ is a set of
  // one-off Node/CommonJS Admin SDK scripts (cleanup/seed), same reasoning.
  globalIgnores(['dist', 'firebase_functions', 'firebase_admin']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
