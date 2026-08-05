// app/src/nav/Nav.tsx

import type{ FC } from 'hono/jsx'
import { css, Style } from 'hono/css'
import svgMenu from '@src/svg/menu.svg?raw'
import { onMenuToggle, onHomeClick } from '@hono-directives'


const Nav: FC = () => {
  return <>
    <Style>{style}</Style>

    <div class="nav">
      <div class="inner">
        <div class="left">
          <a data-directive={onHomeClick()} href="/" class="logo">
            <div class="img">
              <img src="logo.webp" />
            </div>
            <span>Shasta Trades</span>
          </a>

          <div class="links">
            <a href="/">Home</a>
            <a href="/objectives">Objectives</a>
            <a href="/transparency">Transparency</a>
          </div>
        </div>

        <button class="sign-in-btn" type="button">Sign In</button>
        <button data-directive={onMenuToggle()} class="menu-btn" type="button" dangerouslySetInnerHTML={{ __html: svgMenu }} />
      </div>
    </div>
  </>
}


const style = css`
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: var(--z-nav);
    backdrop-filter: blur(4px);
    background-color: rgba(248, 250, 248, 0.95);
    box-shadow: 0px 5px 18px -1px rgba(0, 0, 0, 0.18);

    .inner .left .links,
    .sign-in-btn {
      @media (max-width: 760px) {
        display: none;
      }
    }

    .inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 auto;
      max-width: var(--max-width);
      padding: var(--space-lite);

      .left {
        display: flex;
        align-items: center;

        .logo {
          font-weight: 700;
          font-size: 3.3rem;
          color: #1B3022;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: calc(var(--space-lite) / 1.5);

          .img {
            width: 4.5rem;
            height: 4.5rem;

            img {
              width: 100%;
            }
          }
        }

        .links {
          a {
            color: rgb(67 72 67);
            text-decoration: none;
            font-weight: 600;
            font-size: 1.71rem;
            padding-left: var(--space);
            &:hover {
              color: rgb(6 27 14);
            }
          }
        }
      }

      .menu-btn,
      .sign-in-btn {
        cursor: pointer;
        transition: all 0.3s;
        &:hover {
          scale: 1.05;
        }
      }

      .sign-in-btn {
        font-size: 1.71rem;
        color: var(--white);
        font-weight: 600;
        border-radius: var(--radius);
        border: none;
        padding: calc(var(--space-lite) / 2) var(--space-lite);
        background-color: var(--primary);
      }

      .menu-btn {
        width: 3.9rem;
        height: 3.9rem;
        color: var(--white);
        border-radius: var(--radius);
        border: none;
        background-color: var(--primary);
        align-items: center;
        justify-content: center;
        display: none;

          @media (max-width: 760px) {
            display: flex;
          }

          svg {
            width: 2.7rem;
            height: 2.7rem;
          }
      }
    }
  }
`


export default Nav
