// app/src/renderer.tsx

import { css, Style } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Script } from 'vite-ssr-components/hono'
import { ViteClient } from 'vite-ssr-components/hono'


export const renderer = jsxRenderer(({ children }) => {
  const cssGlobal = css`
    * {
      box-sizing: border-box;
    }

    html {
      font-family: Arial, Helvetica, sans-serif;
    }
  `

  return <>
    <html>
      <head>
        <Style>{cssGlobal}</Style>
        <ViteClient />
        <Script src='/src/script.ts' />
      </head>
      <body>{children}</body>
    </html>
  </>
})
