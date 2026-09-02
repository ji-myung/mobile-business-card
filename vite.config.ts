/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import { qrPlugin } from './scripts/vite-plugin-qr'
import { vcardPlugin } from './scripts/vite-plugin-vcard'

export default defineConfig({
  base: '/corelink-mobile/',
  plugins: [vcardPlugin(), qrPlugin()],
  build: { target: 'es2022' },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.ts'],
  },
})
