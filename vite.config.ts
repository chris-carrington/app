// app/vite.config.ts
 
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite'
import ssrPlugin from 'vite-ssr-components/plugin'
import { cloudflare } from '@cloudflare/vite-plugin'
import honoDirectives from './hono-directives/src/plugin.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@hono-directives': path.resolve(__dirname, 'hono-directives/dist/index'),
    },
  },
  plugins: [
    cloudflare(),
    ssrPlugin(),
    honoDirectives()
  ]
})
