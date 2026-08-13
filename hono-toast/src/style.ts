// app/hono-toast/src/style.ts

import { css } from 'hono/css'


export const honoToastStyle = css`
  #hono-toast-wrapper {
    pointer-events: none;
    position: fixed;
    z-index: var(--z-modal);
    inset: 0;
    top: 0;
    overflow: hidden; /** prevent scrollbar for offscreen toasts sliding in */

    .hono-toast-container {
      position: absolute;
      display: flex;
      flex-direction: column;
      padding: var(--space-lite);
      width: 100%;
      max-width: 45rem;;
      pointer-events: none;
      &.hono-toast-container--topCenter {
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        align-items: center;
      }
      &.hono-toast-container--topLeft {
        top: 0;
        left: 0;
        align-items: flex-start;
      }
      &.hono-toast-container--topRight {
        top: 0;
        right: 0;
        align-items: flex-end;
      }
      &.hono-toast-container--bottomCenter {
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        align-items: center;
        flex-direction: column-reverse; /** ensures that new toasts appear at the bottom and push older ones upward */
      }
      &.hono-toast-container--bottomLeft {
        bottom: 0;
        left: 0;
        align-items: flex-start;
        flex-direction: column-reverse;
      }
      &.hono-toast-container--bottomRight {
        bottom: 0;
        right: 0;
        align-items: flex-end;
        flex-direction: column-reverse;
      }

      .toast {
        pointer-events: auto;
        margin-bottom: var(--space-lite); /** don't use a gap or else when a toast is shrunk down on close it'll still create extra space before being removed from the DOM */
        overflow: hidden;
        padding: var(--space-lite);
        border-radius: calc(var(--radius) * 2);
        display: flex;
        align-items: center;
        color: var(--popover-foreground);
        background: var(--popover);
        animation-duration: 0.9s;
        animation-fill-mode: both;
        transition: var(--transition);
        max-width: var(--toast-width);
        box-shadow: var(--shadow-subtle);
        &:focus {
          outline: none;
        }
        &.toast--top {
          animation-name: ace-fade-down;
        }
        &.toast--bottom {
          animation-name: ace-fade-up;
        }

        .toast__content {
          flex: auto;
          margin-inline: calc(var(--space) * 2);

          ul,
          ol {
            padding: 0;
            margin: 0 0 0 calc(var(--space) * 5);
        
            li {
              margin-block: var(--space);
            }
          }
        }

        .toast__icon-wrapper {
          flex-grow: 0;
          flex-shrink: 0;
          width: 3.6rem;
          height: 3.6rem;
          min-width: 3.6rem;
          min-height: 3.6rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-inline: 0 var(--space);

          .toast__icon {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            border-radius: 0.9rem;
            flex-grow: 0;
            flex-shrink: 0;
            width: 3.6rem;
            min-width: 3.6rem;
            height: 3.6rem;
            min-height: 3.6rem;
            color: var(--toast-icon-color);
            background: var(--toast-icon-bg);
        
            svg {
              flex-grow: 0;
              flex-shrink: 0;
              width: 2.4rem;
              min-width: 2.4rem;
              height: 2.4rem;
              min-height: 2.4rem;
            }
          }
        }

        .toast__close {
          background: transparent;
          border-radius: 50%;
          color: var(--muted-foreground);
          transition: var(--fast-transition);
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-grow: 0;
          flex-shrink: 0;
          height: 2.97rem;
          min-height: 2.97rem;
          width: 2.97rem;
          min-width: 2.97rem;
          border: none;

          &:hover {
            cursor: pointer;
            box-shadow: var(--shadow-subtle);
          }

          svg {
            flex-grow: 0;
            flex-shrink: 0;
            width: 1.86rem;
            min-width: 1.86rem;
            height: 1.86rem;
            min-height: 1.86rem;
          }
        }
      }
    }
  }
`
