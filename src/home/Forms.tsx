// app/src/lib/Forms.tsx

import type{ FC } from 'hono/jsx'
import { css, Style } from 'hono/css'
import svgTree from '@src/svg/tree.svg?raw'
import { hashChange } from '@hono-directives'
import svgMoney from '@src/svg/money.svg?raw'
import svgFence from '@src/svg/fence.svg?raw'
import svgConstruction from '@src/svg/construction.svg?raw'


const Forms: FC = () => {
  return <>
    <Style>{style}</Style>

    <div class="forms" data-directive={hashChange()}>
      <div class="bg" />

      <div class="content">
        <div class="buttons">
          <a href="#service-request">SERVICE REQUEST</a>
          <a href="#join-leadership">JOIN LEADERSHIP</a>
          <a href="#join-newsletter">JOIN NEWSLETTER</a>
          <a href="#contact-us">CONTACT US</a>
        </div>

        <ServiceRequest />
        <JoinLeadership />
      </div>
    </div>
  </>
}


const ServiceRequest: FC = () => {
  const items = [
    { id: "pallets", icon: svgTree, title: 'Reclaimed Lumber Construction', description: `We'll turn wood that's headed to the landfill into beauty (e.g., tables, planters) to reduce new wood harvesting` },
    { id: "fence", icon: svgFence, title: 'Fence', description: 'Install new or address structural instability, material decay, and/or hardware failures to ensure safety and longevity' },
  ]

  return <>
    <div id="service-request" class="form hidden">
      <div class="badge">COMMUNITY SERVICES</div>
      <div class="flex">
        <div class="left">
          <div class="title">Professional Services</div>
          <div class="description">Our master trades professionals lead every project, ensuring lovely results and hands-on education. Our services include:</div>
          <div class="items">
            {items.map(item => {
              return <>
                <div class="item">
                  <div class="icon" dangerouslySetInnerHTML={{ __html: item.icon }}></div>
                  <div class="info">
                    <div class="primary">{item.title}</div>
                    <div class="secondary">{item.description}</div>
                  </div>
                </div>
              </>
            })}
          </div>
        </div>

        <div class="right">
          <div class="mask"></div>
          <div class="inputs">
            <div class="title">Hire Trade Professionals</div>
            <form>
              <div class="two">
                <input type="text" name="firstName" placeholder="First Name" />
                <input type="text" name="lastName" placeholder="Last Name" />
              </div>
              <input type="email" name="email" placeholder="Email" />
              <select name="interest">
                <option value="">Select Interested Service</option>
                {items.map(item => <option value={item.id}>{item.title}</option>)}
              </select>
              <button type="submit">Hire Trade Professionals</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}


const JoinLeadership: FC = () => {
  const items = [
    { id: "tradesPerson", icon: svgConstruction, title: 'Tradesperson', description: 'An apprentice guided towards a general contractor license or a licensed mentor ready to aid the next generation' },
    { id: "cfo", icon: svgMoney, title: 'CFO', description: 'Responsible for our fiscal health, guide our financial decisions and ensure all expenses are mission focused' },
  ]

  return <>
    <div id="join-leadership" class="form hidden">
      <div class="badge">LEAD BY EXAMPLE</div>
      <div class="flex">
        <div class="left">
          <div class="title">Join Leadership Team</div>
          <div class="description">We are uniting a visionary Board and dedicated Staff to lead by example! Current openings include:</div>
          <div class="items">
            {items.map(item => {
              return <>
                <div class="item">
                  <div class="icon" dangerouslySetInnerHTML={{__html: item.icon}}></div>
                  <div class="info">
                    <div class="primary">{item.title}</div>
                    <div class="secondary">{item.description}</div>
                  </div>
                </div>
              </>
            })}
          </div>
        </div>

        <div class="right">
          <div class="mask"></div>
          <div class="inputs">
            <div class="title">Join Leadership Team</div>
            <form>
              <div class="two">
                <input type="text" name="firstName" placeholder="First Name" />
                <input type="text" name="lastName" placeholder="Last Name" />
              </div>
              <input type="email" name="email" placeholder="Email" />
              <select name="interest">
                <option value="">Select Interest Area</option>
                {items.map(item => <option value={item.id}>{item.title}</option>)}
              </select>
              <button type="submit">Join Leadership Team</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
}


const style = css`
  .forms {
    width: 100%;
    min-height: 69rem;
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
        scroll-margin-top: 18rem;
        &.hidden {
          display: none;
        }

        .badge {
          display: inline-block;
          color: rgb(255 220 195);
          background-color: rgb(144 77 0 / 0.1);
          border: 1px solid rgb(144 77 0 / 0.2);
          padding: calc(var(--space-lite) / 2) var(--space-lite);
          border-radius: var(--radius);
          margin-bottom: var(--space-lite);
        }

        .flex {
          display: flex;
          gap: var(--space-huge);

          .left,
          .right {
            width: 50%;
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
              margin-bottom: var(--space);
            }

            .items {
              .item {
                padding: var(--space-lite);
                margin-bottom: var(--space-lite);
                display: flex;
                align-items: center;
                gap: var(--space-lite);
                background-color: rgb(255 255 255 / 0.05);
                border-radius: calc(var(--radius) * 3);
                border: 1px solid rgb(255 255 255 / 0.1);
                &:last-child {
                  margin-bottom: 0;
                }

                .icon {
                  color: rgb(255 220 195);
                }

                .info {
                  .primary {
                    color: var(--white);
                    font-weight: 700;
                  }

                  .secondary {
                    color: rgb(180 205 184);
                    font-family: var(--font-family-serif);
                    font-size: 1.68rem;
                  }
                }
              }
            }
          }

          .right {
            position: relative;
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

            .title {
              color: var(--white);
              font-weight: 700;
              font-size: 1.68rem;
              margin-bottom: var(--space-lite);
            }

            .inputs {
              padding: var(--space);
              position: relative;
              z-index: var(--z-content);

              .two {
                display: flex;
                gap: var(--space-lite);

                input {
                  width: 50%;
                }
              }

              input,
              select {
                width: 100%;
                display: block;
                color: var(--white);
                padding: var(--space-lite);
                margin-bottom: var(--space-lite);
                border-radius: var(--radius);
                background-color: rgb(255 255 255 / 0.05);
                border: 1px solid rgb(255 255 255 / 0.1);
                &:focus {
                  border-color: transparent;
                  outline: 0;
                  box-shadow: 0 0 0 0.3rem rgba(0, 123, 255, 0.6);
                }
              }

              button {
                width: 100%;
                background-color: var(--orange);
                border-color: transparent;
                font-weight: 600;
                border-radius: var(--radius);
                padding: calc(var(--space-lite) * 0.9) calc(var(--space-lite) * 1.5); 
                color: var(--orange-text);
                transition: all 0.3s;
                cursor: pointer;
                &:hover {
                  scale: 1.02;
                }
              }
            }
          }
        }
      }
    }
  }
`


export default Forms
