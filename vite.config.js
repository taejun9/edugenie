import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return {
      plugins: [vue()],
      server: {
        host: '0.0.0.0',
        https: {
          key: fs.readFileSync('./.cert/key.pem'),
          cert: fs.readFileSync('./.cert/cert.pem'),
        },
        hmr: {
          host: 'local.github.io',
        },
      },
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
      },
    }
  } else {
    // command === 'build'
    return {
      server: {
        host: '0.0.0.0',
      },
      plugins: [vue()],
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
      },
      build: {
        chunkSizeWarningLimit: 1600,
      },
      base: '/',
    }
  }
})
