// app/src/renderer.tsx

import { css, Style } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Script } from 'vite-ssr-components/hono'
import { ViteClient } from 'vite-ssr-components/hono'


export const renderer = jsxRenderer(({ children }) => {

  return <>
    <html>
      <head>
        <Style>{style}</Style>
        <ViteClient />
        <Script src='/src/script.ts' />
      </head>
      <body>{children}</body>
    </html>
  </>
})


const style = css`
  :root {
    --font-size: 1.8rem;
    --line-height: 1.41;
    --radius: 0.45rem;
    --space: 3rem;
    --space-lite: 1.5rem;
    --space-big: 4.5rem;
    --space-huge: 6.3rem;
    --max-width: 123rem;
    --speed: all 0.3s ease;
    --white: rgb(248, 250, 248);
    --font-family: Arial, Helvetica, sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background-color: var(--white);
  }

  html {
    font-size: 62.5%; /* https://stackoverflow.com/questions/59920538 */
    scroll-behavior: smooth;
  }

    body,
    input,
    select,
    textarea,
    button {
      line-height: var(--line-height);
      font-family: var(--font-family);
      font-size: var(--font-size);
    }
`
