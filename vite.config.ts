import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Used by Storybook dev server only — not the library build.
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
})
