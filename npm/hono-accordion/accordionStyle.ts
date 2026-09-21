// app/npm/hono-accordion/accordionStyle.ts

import { css } from 'hono/css'


export const accordionStyle = css`
  .accordion-item {
    margin-bottom: var(--space-lite);
    &.open {
      .accordion-chevron {
        transform: rotate(90deg);
      }
    }

    .accordion-header {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 0.5rem 0;
      user-select: none;
      transition: var(--fast-transition);

      &:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }
    }

    .accordion-chevron {
      flex-shrink: 0;
      width: 2.4rem;
      height: 2.4rem;
      margin-right: calc(var(--space-lite) / 2);
      transition: var(--transition);
    }

    .accordion-title {
      flex: 1; 

      /* reset heading margins inside the title */
      h1,
      h2,
      h3 {
        display: flex;
        align-items: center;
        gap: 0.45rem;
        margin: 0;
        font-size: 2.4rem; /* optionally keep heading hierarchy */

        svg {
          width: 2.4rem;
          height: 2.4rem;
        }
      }
    }

    .accordion-body {
      overflow: hidden;
      transition: var(--transition);
      height: 0; /* will be set by JavaScript */

      > *:first-child {
        margin-block: var(--space-lite);
      }

      > *:last-child {
        margin-bottom: 0;
      }
    }
  }
`
