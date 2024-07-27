import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

export default defineConfig({
  plugins: [
    react(),
    // @ts-ignore
    crx({ manifest }),
  ],
  server: {
    port: 5174,
    strictPort: true,
    hmr: {
      port: 5174,
    },
  },
  build: {
    rollupOptions: {
      input: {
        sidepane: 'index.html',
      },
    },
  },
})
