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
    &[data-auth="undefined"] {
      .item[data-auth="loading"] {
        display: block;
      }

      .item[data-auth="false"],
      .item[data-auth="true"] {
        display: none;
      }
    }
    &[data-auth="true"] {
      .item[data-auth="true"] {
        display: block;
      }

      .item[data-auth="false"],
      .item[data-auth="loading"] {
        display: none;
      }
    }
    &[data-auth="false"] {
      .item[data-auth="false"] {
        display: block;
      }

      .item[data-auth="true"],
      .item[data-auth="loading"] {
        display: none;
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
        &.lite {
          opacity: 0.6;
        }
        &.header {
          opacity: 0.6;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid rgba(0,0,0,0.21);

          .close {
            padding: 0;
            height: 2.4rem;
            width: 2.4rem;
            border: none;
            cursor: pointer;
            background: transparent;
            transition: var(--transition);
            &:hover {
              scale: 1.11;
            }

            svg {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    @media (min-height: 721px) {
      .items {
        top: var(--space-huge);
        border-radius: var(--radius);
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, .1);
        left: 50%;
        right: auto;
        bottom: auto;
        width: 100%;
        max-width: 51rem;
        transform: translateX(-50%) translateY(calc(-100% - 1px)); /* start above the viewport, horizontally centered */
      }

      &:not(.hidden) .items {
        transform: translateX(-50%) translateY(0); /* slide down to its final position */
      }
    }
  }

  @media (min-height: 721px) and (max-width: 600px) {
    .items {
      max-width: calc(100% - var(--space)) !important;
    }
  }
`
