/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/mobile-business-card/',
  build: { target: 'es2022' },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.ts'],
  },
})
