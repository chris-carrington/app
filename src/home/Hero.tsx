// app/src/lib/Hero.tsx

import type{ FC } from 'hono/jsx'
import { css, Style } from 'hono/css'


const Hero: FC = () => {
  return <>
    <Style>{style}</Style>

    <div class="hero">
      <div class="bg-img">
        <div class="mask"></div>
        <img src="/mt-shasta.webp" alt="Mount Shasta in Northern California" />
      </div>

      <div class="content">
        <div class="left">
          <div class="badge">
            <div class="pulse"></div>
            <div class="label">PRE-LAUNCH PHASE</div>
          </div>
          <div class="title">
            <div class="top">Building Careers.</div>
            <div class="bottom">Supporting Community.</div>
          </div>
          <div class="message">Shasta Trades is laying the foundation for a new era of skilled labor. We are currently in our pre-launch phase. So we're establishing the trust, leadership and fundamentals required, to support our lovely Mount Shasta community!</div>
          <div class="ctas">
            <a href="#service-request" class="primary">SERVICE REQUEST</a>
            <a href="#join-leadership" class="secondary">JOIN LEADERSHIP</a>
          </div>
        </div>
        <div class="right">
          <div class="img">
            <img src="/chisel.webp" alt="Craftsman using a chisel to do woodworking" />
          </div>
          <div class="border"></div>
          <div class="top-box"></div>
          <div class="bottom-box"></div>
        </div>
      </div>
    </div>
  </>
}


const style = css`
  .hero {
    position: relative;

    .content {
      margin: 0 auto;
      max-width: var(--max-width);
      padding: var(--space-huge) var(--space-lite);
      position: relative;
      z-index: var(--z-mask);
      display: flex;
      gap: calc(var(--space-huge) * 3);

      @media (max-width: 1080px) {
        padding: var(--space) var(--space-lite);
      }

      .left {
        @media (max-width: 1080px) {
          width: 69%;
          max-width: 69%;
        }

        @media (max-width: 700px) {
          width: 100%;
          max-width: 100%;
        }

        .badge {
          display: inline-flex;
          gap: 0.9rem;
          align-items: center;
          margin-bottom: var(--space);
          padding: calc(var(--space-lite) / 3) var(--space-lite);
          border-radius: calc(var(--radius) * 4);
          border: 1px solid rgb(144 77 0 / 0.4);
          background-color: rgb(254 147 44 / 0.2);

          .pulse {
            width: 0.9rem;
            height: 0.9rem;
            border-radius: 50%;
            background-color: rgb(144 77 0);
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          .label {
            font-size: 1.38rem;
            color: rgb(255 220 195);
          }
        }

        .title {
          font-size: 4.5rem;
          font-family: var(--font-family-serif);
          line-height: 1.32;
          font-weight: 600;
          margin-bottom: var(--space);

          .top {
            color: var(--white);
          }

          .bottom {
            font-style: italic;
            color: rgb(255 183 125);
          }
        }

        .message {
          font-size: 2.1rem;
          font-family: var(--font-family-serif);
          color: rgb(180 205 184);
          margin-bottom: var(--space);
        }

        .ctas {
          display: flex;
          gap: var(--space-lite);

          @media (max-width: 540px) {
            flex-direction: column;
          }

          .primary,
          .secondary {
            white-space: nowrap;
            font-weight: 600;
            text-decoration: none;
            border-radius: var(--radius);
            padding: calc(var(--space-lite) * 0.9) calc(var(--space-lite) * 1.5);

            @media (max-width: 540px) {
              text-align: center;
            }
          }

          .primary {
            color: var(--orange-text);
            background-color: var(--orange);
            border: 2px solid rgb(254 147 44);
          }

          .secondary {
            color: rgb(255 255 255);
            background-color: transparent;
            border: 2px solid rgb(180 205 184);
          }
        }
      }

      .right {
        position: relative;
        transform: translateX(-1.5rem);

        @media (max-width: 1080px) {
          display: none;
        }

        .img {
          height: 54rem;
          width: 39rem;
          overflow: hidden;

          img {
            height: 100%;
            filter: grayscale(1);
            transform: translateX(-39%); 
          }
        }

        .border,
        .top-box,
        .bottom-box {
          position: absolute;
          z-index: var(--z-content);
        }

        .border {
          top: 0;
          left: 0;
          height: 57rem;
          width: 42rem;
          border: 2px solid rgba(208, 233, 212, 0.2);
          transform: translate(-1.5rem, -1.5rem); 
        }

        .top-box,
        .bottom-box {
          width: 5.4rem;
          height: 5.4rem;
          border-style: solid;
          border-color: rgb(144, 77, 0);
        }

        .top-box {
          top: -3rem;
          left: -3rem;
          border-top-width: 2px;
          border-left-width: 2px;
          border-bottom-width: 0;
          border-right-width: 0;
        }

        .bottom-box {
          bottom: -3rem;
          right: -3rem;
          border-bottom-width: 2px;
          border-right-width: 2px;
          border-top-width: 0;
          border-left-width: 0;
        }
      }
    }

    .bg-img {
      width: 100%;
      height: 100%;
      position: absolute;

      .mask,
      img {
        position: absolute;
        width: 100%;
        height: 100%;
      }

      .mask {
        z-index: var(--z-mask);
        background-image: linear-gradient(to right,rgb(27,48,34),rgba(27,48,34,0.72),rgba(0,0,0,0));

        @media (max-width: 700px) {
          background-image: linear-gradient(to right,rgb(27,48,34),rgba(27,48,34,0.60));
        }
      }

      img {
        opacity: 0.3;
        object-fit: cover;
        z-index: var(--z-below-mask);
      }
    }
  }

  @keyframes pulse {
    50% {
      opacity: .5;
    }
  }
`


export default Hero
