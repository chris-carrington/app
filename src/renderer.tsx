// app/src/renderer.tsx

import Nav from '@src/nav/Nav'
import Footer from '@src/lib/Footer'
import { css, Style } from 'hono/css'
import NavModal from '@src/nav/NavModal'
import AuthModal from '@src/auth/AuthModal'
import { honoToastStyle } from '@hono-toast'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Script } from 'vite-ssr-components/hono'
import { ViteClient } from 'vite-ssr-components/hono'


export const renderer = jsxRenderer(({ children }) => <>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="theme-color" content="#F9FBF9" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="preload" as="font" href="/fonts/proxima_nova_400.woff2" type="font/woff2" crossorigin="anonymous"></link>
      <link rel="preload" as="font" href="/fonts/proxima_nova_500.woff2" type="font/woff2" crossorigin="anonymous"></link>
      <link rel="preload" as="font" href="/fonts/proxima_nova_600.woff2" type="font/woff2" crossorigin="anonymous"></link>
      <Style>{style}</Style>
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
</>)


const style = css`
  :root {
    --font-size: 1.86rem;
    --line-height: 1.5;
    --radius: 0.45rem;
    --space: 3rem;
    --space-lite: 1.5rem;
    --space-big: 4.5rem;
    --space-huge: 6.3rem;
    --max-width: 123rem;
    --speed: all 0.3s ease;
    --font-family-arial: ProximaNova;
    --font-family-serif: Georgia, 'Times New Roman', Times, serif;

    --primary: #1b3022;
    --white: #F9FBF9;
    --orange: #fe932c;
    --orange-gradient: linear-gradient(135deg, var(--orange), #fb9838);
    --orange-text: #663500;
    --muted-foreground: oklch(0.63 0 0);
    --primary-gradient: linear-gradient(135deg, #2b4c36, #23422d);

    --popover: oklch(0.21 0.034 264.665);
    --popover-foreground: oklch(100% 0 0);

    --easing: ease-in-out;
    --duration-fast: 120ms;
    --duration-normal: 300ms;
    --fast-transition: all var(--duration-fast) var(--easing);
    --transition: all var(--duration-normal) var(--easing);
    --prop-transition: var(--duration-normal) var(--easing);
    --fast-prop-transition: var(--duration-fast) var(--easing);

    --shadow-subtle:
      0 0.2rem 1rem rgba(0, 0, 0, 0.35),
      0 1px 0.3rem rgba(255, 255, 255, 0.05) inset;
    --shadow-big: 
      0 0.4rem 10.8rem oklch(84.194% 0.16831 90.435 / 0.27),
      0 0 8rem oklch(83.275% 0.17076 95.709 / 0.12),
      0 0 15rem oklch(83.275% 0.17076 95.709 / 0.06),
      inset 0 1px 0.3rem oklch(100% 0.00011 271.152 / 0.35),
      inset 0 -0.3rem 0.6rem oklch(0% 0 0 / 0.55);

    --toast-max-width: 45rem;

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
    font-weight: 400;
  }

  body {
    padding-top: 7.6rem;
  }

  main {
    min-height: calc(100vh - 27rem);
  }

  @font-face {
    font-family: ProximaNova;
    font-weight: 400;
    src: url("/fonts/proxima_nova_400.woff2") format("truetype");
  }

  @font-face {
    font-family: ProximaNova;
    font-weight: 500;
    src: url("/fonts/proxima_nova_500.woff2") format("truetype");
  }

  @font-face {
    font-family: ProximaNova;
    font-weight: 600;
    src: url("/fonts/proxima_nova_600.woff2") format("truetype");
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes pulse {
    50% {
      opacity: .5;
    }
  }

  @keyframes fade-in {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes fade-down {
    0% {
      opacity: 0;
      transform: translateY(-3rem);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fade-up {
    0% {
      opacity: 0;
      transform: translateY(3rem);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`
