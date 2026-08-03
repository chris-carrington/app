// app/src/lib/Nav.tsx

import type{ FC } from 'hono/jsx'
import { css, Style } from 'hono/css'


const Nav: FC = () => {
  return <>
    <Style>{style}</Style>

    <div class="nav">
      <div class="inner">
        <div class="left">
          <a href="/" class="name">
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
        <button type="button">Sign In</button>
      </div>
    </div>
  </>
}


const style = css`
  .nav {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: var(--z-nav);
    backdrop-filter: blur(4px);
    background-color: rgba(248, 250, 248, 0.95);
    box-shadow: 0px 5px 18px -1px rgba(0, 0, 0, 0.18);

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

        .name {
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

      button {
        font-size: 1.71rem;
        color: var(--white);
        font-weight: 600;
        border-radius: var(--radius);
        border: none;
        padding: calc(var(--space-lite) / 2) var(--space-lite);
        background-color: var(--primary);
      }
    }
  }
`


export default Nav
