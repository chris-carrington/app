// app/src/lib/Footer.tsx

import type { FC } from 'hono/jsx'
import { css, Style } from 'hono/css'
import { urlBE } from '@src/url/urlBE'
import svgTikTok from '@src/svg/tikTok.svg?raw'
import svgYoutube from '@src/svg/youtube.svg?raw'
import svgFacebook from '@src/svg/facebook.svg?raw'
import svgInstagram from '@src/svg/instagram.svg?raw'


export default (() => {
  const url = urlBE()

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
            <a href={url['index'].$url().href}>Home</a>
            <a href={url['mastery'][':id?'].$url({ param: { id: '' } }).href}>Mastery</a>
            <a href={url['objectives'].$url().href}>Objectives</a>
            <a href={url['transparency'][':id?'].$url({ param: { id: '' } }).href}>Transparency</a>
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
}) satisfies FC


const style = css`
  footer {
    font-size: 1.86rem;
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
        font-weight: 600;
        font-size: 2.4rem;
        color: var(--white);
        margin-bottom: var(--space-lite);
      }

      .dedication {
        color: rgb(129 153 134);
        max-width: 69%;
        font-size: 1.86rem;

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
      gap: calc(var(--space) * 2.4);

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
            filter: grayscale(0.4);
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
            opacity: 0.6;
            filter: grayscale(0.45);
            transition: var(--fast-transition);
            text-decoration: none;
            &:hover {
              scale: 1.05;
              opacity: 1;
              filter: none;
            }
          }
        }
      }
    }
  }
`
