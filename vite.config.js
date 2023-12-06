import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { resolve } from 'path'

// let __dirname = fileURLToPath(new URL('.', import.meta.url))
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  base: "/",
  build:{
    rollupOptions:{
      input:{
        main: 'index.html',
        login: '/login/index.html',
        // main: resolve(__dirname, 'index.html'),
        // login: resolve(__dirname, '/login/index.html')
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
