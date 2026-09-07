// app/src/lib/mdStyle.ts

import { css } from 'hono/css'


export const mdStyle = css`
  .md {
    margin: 0 auto;
    max-width: var(--max-width);
    padding: 0 var(--space-lite) var(--space-huge) var(--space-lite);

    h1,
    h2 {
      margin-top: 0;
      font-weight: 600;
      color: var(--primary);
    }

    h1 {
      font-size: 3.3rem;
      margin-bottom: var(--space-lite);
    }

    h2 {
      font-size: 2.4rem;
      margin-bottom: calc(var(--space-lite) / 2);
    }

    p,
    ul {
      margin-top: 0;
    }

    hr {
      height: 1px;
      width: 100%;
      border: none;
      background: linear-gradient(90deg, transparent 0%, rgba(6, 27, 14, 0.1) 9%, rgba(6, 27, 14, 0.1) 91%, transparent 100%);
      margin: var(--space-huge) 0;
    }

    a {
      color: var(--orange);
      text-decoration: none;
      transition: var(--transition-fast);
      &:hover {
        text-decoration: underline;
      }
    }

    .signature {
      font-family: cursive;
      text-decoration: underline;
    }

    .responsive {
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch; // Smooth scrolling on iOS
      border-radius: var(--radius);
      border: 1px solid #dee2e6;

      table {
        width: 100%;
        color: #212529;
        background-color: #fff;
        border-collapse: separate; /* required for border-radius to work */
        border-spacing: 0; /* remove gaps between cells */

        th, td {
          padding: 0.6rem;
          vertical-align: top;
          width: 33%;
          border-top: 1px solid #dee2e6;
          border-left: 1px solid #dee2e6;
          white-space: nowrap;
          &:first-child {
            border-left: none; /* Remove left border from the very first column */
          }
        }

        tr:first-child { /* Remove top border from the very first row */
          th, td {
            border-top: none;
          }
        }

        th {
          padding: 0.9rem 0.6rem;
          text-align: left;
          border-bottom: 2px solid #dee2e6;
        }

        tbody tr:nth-of-type(odd) { /* striped rows */
          background-color: rgba(0, 0, 0, 0.05);
        }
      }
    }

    .accordion-item {
      margin-bottom: var(--space-lite);

      .accordion-header {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 0.5rem 0;
        user-select: none;
        transition: var(--transition-fast);

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

      &.open .accordion-chevron {
        transform: rotate(90deg);
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

        /* ensure no extra spacing */
        > *:first-child {
          margin-top: 0;
        }

        > *:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
`
