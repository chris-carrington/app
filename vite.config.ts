// app/vite.config.ts
 
import path from 'path'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { cloudflare } from '@cloudflare/vite-plugin'
import honoDirectives from './hono-directives/src/plugin'


export default defineConfig({
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@hono-directives': path.resolve(__dirname, 'hono-directives/dist/index'),
      '@hono-signals': path.resolve(__dirname, 'hono-signals/src/index'),
    },
  },
  plugins: [
    cloudflare(),
    solidPlugin({ include: ['**/*.solid.tsx', '**/*.directive.tsx'] }),
    honoDirectives()
  ]
})
