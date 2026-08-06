// app/src/lib/Footer.tsx

import type{ FC } from 'hono/jsx'
import { css, Style } from 'hono/css'
import svgTikTok from '@src/svg/tikTok.svg?raw'
import svgYoutube from '@src/svg/youtube.svg?raw'
import svgFacebook from '@src/svg/facebook.svg?raw'
import svgInstagram from '@src/svg/instagram.svg?raw'


const Footer: FC = () => {
  return <>
    <Style>{style}</Style>

    <footer>
      <div class="left">
        <div class="title">Shasta Trades</div>
        <div class="dedication">We are dedicated to help students become licensed contractors through paid apprenticeships, to offer mentors work they love, and to provide affordable, high-quality trade services, to our lovely Mount Shasta community. 💚</div>
      </div>
      <div class="right">
        <div class="site-map">
          <div class="title">SITE MAP</div>
          <div class="links">
            <a href="/">Home</a>
            <a href="/objectives">Objectives</a>
            <a href="/transparency">Transparency</a>
            <a href="/sign-in">Sign In</a>
          </div>
        </div>
        <div class="socials">
          <div class="title">CONNECT</div>
          <div class="links">
            <a href="https://instagram.com" dangerouslySetInnerHTML={{ __html: svgInstagram }} target="_blank" class="link"></a>
            <a href="https://facebook.com" dangerouslySetInnerHTML={{ __html: svgFacebook }} target="_blank" class="link"></a>
            <a href="https://youtube.com" dangerouslySetInnerHTML={{ __html: svgYoutube }} target="_blank" class="link"></a>
            <a href="https://tiktok.com" dangerouslySetInnerHTML={{ __html: svgTikTok }} target="_blank" class="link"></a>
          </div>
        </div>
      </div>
    </footer>
  </>
}


const style = css`
  footer {
    font-size: 1.68rem;
    padding: var(--space);
    display: flex;
    justify-content: space-between;
    background-color: var(--primary);

    @media (max-width: 1230px) {
      padding: var(--space) var(--space-lite);
    }

    @media (max-width: 510px) {
      flex-direction: column;
      gap: var(--space);
    }

    .left {

      .title {
        font-weight: 700;
        font-size: 2.4rem;
        color: var(--white);
        margin-bottom: var(--space-lite);
      }

      .dedication {
        color: rgb(129 153 134);
        max-width: 69%;
        font-size: 1.68rem;

        @media (max-width: 800px) {
          max-width: 81%;
        }

        @media (max-width: 510px) {
          max-width: 100%;
        }
      }
    }

    .right {
      display: flex;
      gap: calc(var(--space) * 3);

      @media (max-width: 800px) {
        flex-direction: column;
        gap: var(--space);
      }

      .title {
        color: var(--orange);
        font-weight: 500;
        margin-bottom: var(--space-lite);
      }

      .site-map {
        .links {
          a {
            display: block;
            text-decoration: none;
            color: rgb(129 153 134);
            margin-bottom: calc(var(--space-lite) / 2);
            &:last-child {
              margin-bottom: 0;
            }
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }

      .socials {
        .links {
          display: flex;
          gap: var(--space-lite);

          a {
            transition: all 0.3s;
            text-decoration: none;
            &:hover {
              scale: 1.05;
            }
          }
        }
      }
    }
  }
`


export default Footer
