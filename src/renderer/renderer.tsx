// app/src/renderer/renderer.tsx

import Nav from '@src/nav/Nav'
import { Style } from 'hono/css'
import Footer from '@src/lib/Footer'
import NavModal from '@src/nav/NavModal'
import AuthModal from '@src/auth/AuthModal'
import { honoToastStyle } from '@hono-toast'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Script } from 'vite-ssr-components/hono'
import RendererHead from '@src/renderer/RendererHead'
import { ViteClient } from 'vite-ssr-components/hono'


export const renderer = jsxRenderer(async ({ children }) => {
  return <>
    <html>
      <head>
        <RendererHead />
        <Style>{honoToastStyle}</Style>
        <ViteClient />
        <Script src='/src/lib/hono-directives-mount.ts' />
      </head>

      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        <NavModal />
        <AuthModal />
      </body>
    </html>
  </>
})
