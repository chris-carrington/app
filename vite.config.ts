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
      '@on-time': path.resolve(__dirname, 'npm/on-time/index'),
      '@hono-dom': path.resolve(__dirname, 'npm/hono-dom/index'),
      '@img-webp': path.resolve(__dirname, 'npm/img-webp/index'),
      '@hono-form': path.resolve(__dirname, 'npm/hono-form/index'),
      '@hono-email': path.resolve(__dirname, 'npm/hono-email/index'),
      '@hono-toast': path.resolve(__dirname, 'npm/hono-toast/index'),
      '@hono-modal': path.resolve(__dirname, 'npm/hono-modal/index'),
      '@hono-api/be': path.resolve(__dirname, 'npm/hono-api/be/index'),
      '@hono-api/fe': path.resolve(__dirname, 'npm/hono-api/fe/index'),
      '@hono-events': path.resolve(__dirname, 'npm/hono-events/index'),
      '@hono-tooltip': path.resolve(__dirname, 'npm/hono-tooltip/index'),
      '@hono-accordion': path.resolve(__dirname, 'npm/hono-accordion/index'),
      '@drizzle-compose': path.resolve(__dirname, 'npm/drizzle-compose/index'),
      '@hono-directives': path.resolve(__dirname, 'npm/hono-directives/dist/index'),
    },
  },
  plugins: [
    cloudflare(),
    ssrPlugin(),
    honoDirectives(),
  ]
})
