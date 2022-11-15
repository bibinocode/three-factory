import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import glsl from 'rollup-plugin-glsl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), glsl({
    include: "**/*.glsl",
    exclude: ['**/index.html']
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
