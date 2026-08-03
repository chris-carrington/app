// app/src/lib/Forms.tsx

import type{ FC } from 'hono/jsx'
import { css, Style } from 'hono/css'


const Forms: FC = () => {
  return <>
    <Style>{style}</Style>

    <div class="forms">
      <div class="bg" />

      <div class="content">
        <div class="buttons">
          <a href="#join-leadership" class="active">JOIN LEADERSHIP</a>
          <a href="#service-request">SERVICE REQUEST</a>
          <a href="#join-newsletter">JOIN NEWSLETTER</a>
          <a href="#contact-us">CONTACT US</a>
        </div>

        <JoinLeadership />
      </div>
    </div>
  </>
}


const JoinLeadership: FC = () => {
  return <>
    <div id="join-leadership" class="form">
      <div class="badge">LEAD BY EXAMPLE</div>
      <div class="flex">
        <div class="left">
          <div class="title">Join Leadership Team</div>
          <div class="description">Shasta Trades is more than a non-profit; it's a movement to reclaim our community's future. We are looking for visionary Board Members and dedicated staff to lead from the front.</div>
        </div>
        <div class="right">
          <div class="mask"></div>
        </div>
      </div>
    </div>
  </>
}


const style = css`
  .forms {
    width: 100%;
    min-height: 54rem;
    margin-bottom: var(--space-huge);
    background-color: var(--primary);
    position: relative;

    .bg {
      position: absolute;
      z-index: var(--z-mask);
      inset: 0;
      opacity: 0.1;
      background-image: url(/wood-pattern.webp);
    }

    .content {
      position: relative;
      z-index: var(--z-content);
      margin: 0 auto;
      max-width: var(--max-width);
      padding: var(--space-huge) var(--space);

      .buttons {
        display: flex;
        justify-content: center;
        gap: var(--space);
        margin-bottom: var(--space);

        a {
          font-weight: 600;
          font-size: 1.71rem;
          text-decoration: none;
          border-radius: calc(var(--radius) * 2);
          color: var(--white);
          padding: var(--space-lite) var(--space);
          border: 1px solid rgb(255 255 255 / 0.2);
          &:hover {
            background-color: rgb(255 255 255 / 0.1);
          }
          &.active {
            color: var(--orange-text);
            background-color: var(--orange);
            border-color: var(--orange);
            &:hover {
              cursor: default;
            }
          }
        }
      }

      .form {
        scroll-margin-top: 12rem;

        .badge {
          display: inline-block;
          color: rgb(255 220 195);
          background-color: rgb(144 77 0 / 0.1);
          border: 1px solid rgb(144 77 0 / 0.2);
          padding: calc(var(--space-lite) / 2) var(--space-lite);
          border-radius: var(--radius);
        }

        .flex {
          display: flex;
          gap: var(--space-huge);

          .left,
          .right {
            max-width: 50%;
          }

          .left {
            .title {
              color: var(--white);
              font-weight: 700;
              font-size: 4.8rem;
            }

            .description {
              color: rgb(180 205 184);
              font-family: var(--font-family-serif);
            }
          }

          .right {
            position: relative;
            z-index: var(--z-content);
            width: 100%;
            border-radius: calc(var(--radius) * 3);
            border: 1px solid rgb(255 255 255 / 0.1);
            background-color: rgb(255 255 255 / 0.05);

            .mask {
              position: absolute;
              inset: 0;
              z-index: var(--z-mask);
              background-color: var(--orange);
              border-radius: calc(var(--radius) * 3);
              opacity: 0.03;
            }
          }
        }
      }
    }
  }
`


export default Forms
