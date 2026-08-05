// app/src/lib/Menu.tsx

import type { FC } from 'hono/jsx'
import { css, Style } from 'hono/css'
import { onMenuToggle } from '@hono-directives'


const Menu: FC = () => {
  return <>
    <Style>{style}</Style>

    <div class="menu hidden">
      <button data-directive={onMenuToggle()} class="backdrop" type="button" />

      <div class="items">
        <div class="item title">Menu</div>
        <a href="/" class="item anchor">Home</a>
        <a href="/objectives" class="item anchor">Objectives</a>
        <a href="/transparency" class="item anchor">Transparency</a>
        <a href="/sign-in" class="item anchor">Sign In</a>
        <button data-directive={onMenuToggle()} class="item btn" type="button">Close Menu</button>
      </div>
    </div>
  </>
}


const style = css`
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
      cursor: pointer;
      background-color: #000;
      border: none;
      opacity: 0;
      transition: opacity 0.3s ease;
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
      transition: transform 0.3s ease;
      will-change: transform;

      .item {
        padding: var(--space);
        &.title,
        &.anchor,
        &.btn {
          display: block;
          color: #262626;
          background-color: transparent;
          border: none;
          text-decoration: none;
        }
        &.anchor,
        &.btn {
          cursor: pointer;
          transition: all 0.3s;
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


export default Menu
