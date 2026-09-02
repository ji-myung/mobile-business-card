/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import { vcardPlugin } from './scripts/vite-plugin-vcard'

export default defineConfig({
  base: '/mobile-business-card/',
  plugins: [vcardPlugin()],
  build: { target: 'es2022' },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.ts'],
  },
})
