// app/src/auth/index.ts

import { css } from 'hono/css'


export const authStyle = css`
  .auth {
    width: calc(100% - var(--space));
    max-width: 51rem;
    padding: var(--space);
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, .1);
    border-radius: calc(var(--radius) * 1.5);
    background-color: #fff;
    border: 1px solid #dae0e4;
    margin: var(--space-huge) auto;
    animation: fade-down var(--prop-transition) forwards;

    .title {
      font-size: 2.4rem;
      line-height: 1.2;
      color: #273142;
      font-weight: 600;
      text-align: center;
      margin-bottom: var(--space);
    }

    a,
    input,
    button {
      width: 100%;
      display: block;
    }

    label {
      display: none !important;
    }

    button {
      margin-bottom: var(--space-lite);
    }

    a {
      text-align: center;
      color: var(--orange);
      text-decoration: none;
      font-weight: 500;
      transition: var(--transition);
      &:hover {
        scale: 1.02;
      }
    }
  }
`
