// app/src/lib/subPageHeroStyle.ts

import { css } from 'hono/css'


export const subPageHeroStyle = css`
  .sub-page-hero {
    width: 100%;
    position: relative;
    margin-bottom: var(--space);
    background-color: var(--primary);
    padding: var(--space) 0 calc(var(--space) * 1.8) 0;

    .bg {
      position: absolute;
      z-index: var(--z-mask);
      inset: 0;
      opacity: 0.1;
      background-image: url(/img/wood-pattern.webp);
    }

    .header,
    .buttons {
      position: relative;
      z-index: var(--z-content);
      padding: 0 var(--space-lite);
    }

    .header {
      margin: 0 auto;
      max-width: var(--max-width);

      h1 {
        font-size: 3.2rem;
        font-weight: 600;
        color: var(--white);
        margin-bottom: var(--space-lite);
      }
      .sub-title {
        color: #dcdfdc;
        width: 100%;
        max-width: 90rem;
      }
    }

    .buttons {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--space-lite);
      margin: var(--space) auto 0 auto;
      max-width: var(--max-width);

      img {
        height: 1.8rem;
        filter: invert(100%);
      }
    }
  }
`
