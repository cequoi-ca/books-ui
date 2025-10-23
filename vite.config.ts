import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import path from 'path'
import fs from 'fs'

// Determine adapter path based on environment
// In Docker: /source/adapter/index.ts
// In local dev: ../../adapter/index.ts
const adapterPath = fs.existsSync('/source/adapter/index.ts')
  ? '/source/adapter/index.ts'
  : path.resolve(__dirname, '../../adapter/index.ts');

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      'ecommerce_adapter': adapterPath,
      'adapter': adapterPath,
    }
  },
  server: {
    host: '0.0.0.0',
    port: 9080,
    allowedHosts: 'all',
    fs: {
      strict: false,
    }
  },
})
