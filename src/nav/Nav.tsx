// app/src/nav/Nav.tsx

import type { FC } from 'hono/jsx'
import { rpcBE } from '@hono-rpc/be'
import { css, Style } from 'hono/css'
import type { AppType } from '@src/index'
import svgMenu from '@src/svg/menu.svg?raw'
import svgPerson from '@src/svg/person.svg?raw'
import { useRequestContext } from 'hono/jsx-renderer'
import { idNavModal, idAuthModal } from '@src/lib/dom'
import { onHomeClick, onNavModalToggle } from '@hono-directives'


export default (() => {
  const rpc = rpcBE<AppType>()
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
            <a href={rpc['index'].$url().href} class={c.req.path === '/' ? 'active' : ''}>Home</a>
            <a href={rpc['mastery'][':id?'].$url({ param: { id: '' } }).href} class={c.req.path.includes('/mastery') ? 'active' : ''}>Mastery</a>
            <a href={rpc['objectives'].$url().href} class={c.req.path === '/objectives' ? 'active' : ''}>Objectives</a>
            <a href={rpc['transparency'][':id?'].$url({ param: { id: '' } }).href} class={c.req.path.includes('/transparency') ? 'active' : ''}>Transparency</a>
          </div>
        </div>

        <button data-directive={onNavModalToggle(idAuthModal().id)} class="auth-modal-btn" type="button" dangerouslySetInnerHTML={{ __html: svgPerson }} />
        <button data-directive={onNavModalToggle(idNavModal().id)} class="nav-modal-btn" type="button" dangerouslySetInnerHTML={{ __html: svgMenu }} />
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
    .auth-modal-btn {
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

      .nav-modal-btn,
      .auth-modal-btn {
        border: none;
        background-color: transparent;
        cursor: pointer;
        transition: var(--transition);
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 4.5rem;
        border-radius: 50%;
        &:hover {
          box-shadow: 0px 10px 9px 1px rgba(0 ,0, 0, 0.33);
          transform: translateY(-0.2rem);
        }
        &:active {
          transform: translateY(0) scale(0.98);
          box-shadow: 0px 9px 3px 0 rgba(0 ,0, 0, 0.33);
        }

        svg {
          color: var(--primary);
          width: 3.9rem;
          height: 3.9rem;
        }
      }

      .auth-modal-btn {

        @media (max-width: 819px) {
          display: none;
        }
      }

      .nav-modal-btn {
        display: none;

          @media (max-width: 819px) {
            display: flex;
          }
      }
    }
  }
`
