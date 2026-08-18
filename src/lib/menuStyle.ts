// app/src/lib/menuStyle.ts

import { css } from 'hono/css'


export const menuStyle = css`
  .menu {
    pointer-events: none;
    visibility: hidden;
    transition: visibility 0s 0.3s; /* hide after animation */
    &:not(.hidden) { /* visible state */
      pointer-events: auto;
      visibility: visible;
      transition: visibility 0s 0s; /* show immediately */

      .backdrop {
        opacity: 0.3;
      }

      .items {
        transform: translateY(0);
      }
    }

    .backdrop {
      position: fixed;
      z-index: var(--z-backdrop);
      inset: 0;
      touch-action: none;
      cursor: default;
      background-color: #000;
      border: none;
      opacity: 0;
      transition: opacity var(--prop-transition);
      will-change: opacity;
    }

    .items {
      position: fixed;
      z-index: var(--z-modal);
      right: 0;
      bottom: 0;
      left: 0;
      background-color: var(--white);
      transform: translateY(calc(100% + 1px)); /* extra safety */
      transition: transform var(--prop-transition);
      will-change: transform;

      .item {
        padding: var(--space-lite);
        display: block;
        color: #262626;
        background-color: transparent;
        border: none;
        text-decoration: none;
        width: 100%;
        text-align: left;
        &.anchor,
        &.btn {
          cursor: pointer;
          transition: var(--transition);
          &:hover {
            text-decoration: underline;
          }
        }
        &.title {
          opacity: 0.6;
        }
      }
    }
  }
`
