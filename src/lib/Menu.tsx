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
        <button data-directive={onMenuToggle()} class="item btn" type="button">Close Menu</button>
      </div>
    </div>
  </>
}


const style = css`
  .menu {
    pointer-events: none;
    &:not(.hidden) { /* Visible state */
      pointer-events: auto;

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
    }

    .items {
      position: fixed;
      z-index: var(--z-modal);
      right: 0;
      bottom: 0;
      left: 0;
      background-color: var(--white);
      transform: translateY(100%);
      transition: transform 0.3s ease;

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
