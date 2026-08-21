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

      a,
      button {
        font-weight: 600;
        font-size: 1.86rem;
        text-decoration: none;
        border-radius: calc(var(--radius) * 2);
        color: var(--white);
        padding: var(--space-lite) 2.1rem;
        border: 1px solid rgb(255 255 255 / 0.2);
        background-color: transparent;
        cursor: pointer;
        transition: var(--transition);
        &:hover {
          scale: 1.02;
          background-color: rgb(255 255 255 / 0.1);
        }
        &.active {
          color: var(--orange-text);
          background-color: var(--orange);
          border-color: var(--orange);
          &:hover {
            cursor: default;
          }
        }
      }
    }
  }
`
