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

    .two {
      display: flex;
      gap: var(--space-lite);
    }

    input,
    button,
    a {
      width: 100%;
      display: block;
    }

    .field {
      margin-bottom: calc(var(--space-lite) + 0.6rem);
    }

    input {
      width: 100%;
      border-radius: var(--radius);
      border: 1px solid #ced3d6;
      padding: var(--space-lite);
      color: #495057;
      transition: var(--fast-transition);
      &:focus {
        outline: 0;
        border-color: transparent;
        box-shadow: 0 0 0 0.3rem rgba(0, 123, 255, .25);
      }
    }

    label {
      display: none;
    }

    a,
    button {
      transition: var(--transition);
      &:hover {
        scale: 1.02;
      }
    }

    button {
      width: 100%;
      border: none;
      outline: 0;
      padding: calc(var(--space-lite) / 1.2);
      margin-bottom: var(--space-lite);
      color: var(--white);
      background-color: var(--primary);
      border-radius: var(--radius);
      cursor: pointer;
      font-weight: 500;
      &:disabled {
        opacity: 0.81;
        cursor: default;
      }
    }

    a {
      text-align: center;
      color: var(--orange);
      text-decoration: none;
      font-weight: 500;
    }

    .error-message {
      color: #ff3333;
      font-size: 1.56rem;
      margin-top: calc(var(--space-lite) - 0.9rem);
    }
  }
`
