// app/src/lib/subPageHeroStyle.ts

import { css } from 'hono/css'


export const subPageHeroStyle = css`
  .sub-page-hero {
    width: 100%;
    padding: var(--space) var(--space-lite) calc(var(--space) * 1.41) var(--space-lite);
    margin-bottom: var(--space-huge);
    background-color: var(--primary);
    position: relative;

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
    }

    .header {
      margin: 0 auto;
      max-width: var(--max-width);
      padding: 0 var(--space-lite) var(--space) var(--space-lite);

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
      justify-content: center;
      flex-wrap: wrap;
      gap: var(--space-lite);

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
        transition: all 0.3s;
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
