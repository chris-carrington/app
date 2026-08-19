// app/src/nav/Nav.tsx

import type{ FC } from 'hono/jsx'
import { css, Style } from 'hono/css'
import svgMenu from '@src/svg/menu.svg?raw'
import { createUrl } from '@src/lib/createUrl'
import svgPerson from '@src/svg/person.svg?raw'
import { useRequestContext } from 'hono/jsx-renderer'
import { onHomeClick, onNavMenuToggle } from '@hono-directives'


export default (() => {
  const url = createUrl()
  const c = useRequestContext()

  return <>
    <Style>{style}</Style>

    <div class="nav">
      <div class="inner">
        <div class="left">
          <a data-directive={onHomeClick()} href="/" class="logo">
            <div class="img">
              <img src="/img/logo.webp" />
            </div>
            <span>Shasta Trades</span>
          </a>

          <div class="links">
            <a href={url['index'].$url().href} class={c.req.path === '/' ? 'active' : ''}>Home</a>
            <a href={url['mastery'][':id?'].$url({ param: { id: '' } }).href} class={c.req.path.includes('/mastery') ? 'active' : ''}>Mastery</a>
            <a href={url['objectives'].$url().href} class={c.req.path === '/objectives' ? 'active' : ''}>Objectives</a>
            <a href={url['transparency'][':id?'].$url({ param: { id: '' } }).href} class={c.req.path.includes('/transparency') ? 'active' : ''}>Transparency</a>
          </div>
        </div>

        <button data-directive={onNavMenuToggle('auth-menu')} class="auth-menu-btn" type="button" dangerouslySetInnerHTML={{ __html: svgPerson }} />
        <button data-directive={onNavMenuToggle('nav-menu')} class="nav-menu-btn" type="button" dangerouslySetInnerHTML={{ __html: svgMenu }} />
      </div>
    </div>
  </>
}) satisfies FC


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
    .auth-menu-btn {
      @media (max-width: 819px) {
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
          font-weight: 600;
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
            font-size: 1.86rem;
            padding-left: var(--space);
            transition: var(--transition);
            display: inline-flex;
            height: 4.6rem;
            align-items: center;
            &:hover {
              scale: 1.05;
            }
            &.active {
              color: var(--primary);
            }
          }
        }
      }

      .nav-menu-btn,
      .auth-menu-btn {
        border: none;
        background-color: transparent;
        cursor: pointer;
        transition: var(--transition);
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 4.5rem;
        &:hover {
          scale: 1.05;
        }

        svg {
          color: var(--primary);
          width: 3.9rem;
          height: 3.9rem;
        }
      }

      .auth-menu-btn {

        @media (max-width: 819px) {
          display: none;
        }
      }

      .nav-menu-btn {
        display: none;

          @media (max-width: 819px) {
            display: flex;
          }
      }
    }
  }
`
