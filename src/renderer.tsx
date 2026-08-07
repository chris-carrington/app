// app/src/renderer.tsx

import Nav from '@src/nav/Nav'
import Menu from '@src/nav/Menu'
import Footer from '@src/lib/Footer'
import { css, Style } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Script } from 'vite-ssr-components/hono'
import { ViteClient } from 'vite-ssr-components/hono'


export const renderer = jsxRenderer(({ children }) => <>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="theme-color" content="#F9FBF9" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <Style>{style}</Style>
      <ViteClient />
      <Script src='/src/script.ts' />
    </head>

    <body>
      <Nav />
      <Menu />
      <main>{children}</main>
      <Footer />
    </body>
  </html>
</>)


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
    --font-family-arial: Arial, Helvetica, sans-serif;
    --font-family-serif: Georgia, 'Times New Roman', Times, serif;

    --primary: #1b3022;
    --white: #F9FBF9;
    --orange: #fe932c;
    --orange-text: #663500;

    --z-modal: 6;
    --z-backdrop: 5;
    --z-nav: 4;
    --z-content: 3;
    --z-mask: 2;
    --z-below-mask: 1;
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
    font-family: var(--font-family-arial);
    font-size: var(--font-size);
  }

  body {
    padding-top: 7.6rem;
  }

  main {
    min-height: calc(100vh - 27rem);
  }
`
