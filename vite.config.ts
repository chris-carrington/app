// app/vite.config.ts
 
import path from 'path';
import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import ssrPlugin from 'vite-ssr-components/plugin'
import { cloudflare } from '@cloudflare/vite-plugin'
import honoDirectives from './npm/hono-directives/src/plugin.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@dom': path.resolve(__dirname, 'npm/dom/index'),
      '@hono-email': path.resolve(__dirname, 'npm/hono-email/index'),
      '@hono-toast': path.resolve(__dirname, 'npm/hono-toast/index'),
      '@hono-modal': path.resolve(__dirname, 'npm/hono-modal/index'),
      '@hono-security': path.resolve(__dirname, 'npm/hono-security/index'),
      '@hono-directives': path.resolve(__dirname, 'npm/hono-directives/dist/index'),
      '@drizzle-compose': path.resolve(__dirname, 'npm/drizzle-compose/index'),
    },
  },
  plugins: [
    cloudflare(),
    ssrPlugin(),
    honoDirectives(),
  ]
})
