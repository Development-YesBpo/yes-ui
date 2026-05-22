import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    passWithNoTests: true,
    include: [
      'src/**/*.test.{ts,tsx}',
      // Story interaction tests (play() functions) run via @storybook/addon-vitest.
      // Uncomment when the first component with a play() story exists:
      // 'src/**/*.stories.{ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.stories.{ts,tsx}',
        'src/**/*.test.{ts,tsx}',
        'src/test-setup.ts',
        'src/index.ts',
      ],
      thresholds: {
        // Start at 0 — enforced thresholds activate once components exist.
        // Raise to 80 after the first component ships.
        lines: 0,
        functions: 0,
        branches: 0,
        statements: 0,
      },
    },
  },
})
