// app/src/lib/Building.tsx

import type{ FC } from 'hono/jsx'
import { css, Style } from 'hono/css'
import court from '@src/svg/court.svg?raw'
import people from '@src/svg/people.svg?raw'
import personCheck from '@src/svg/personCheck.svg?raw'


const Building: FC = () => {
  const steps = [
    { icon: court, title: 'Creating the Business', description: 'We are currently creating the Shasta Trades Trust & Shasta Trades Nonprofit, to ensure long term mission aligned stewardship.' },
    { icon: people, title: 'Trades Recruitment', description: 'Recruiting our first cohort of tradespeople to bring beauty to our community at a lovely price is a top priority.' },
    { icon: personCheck, title: 'Executive Search', description: 'Actively seeking committed professionals to guide our operations with transparency, precision and rigor.' },
  ]

  return <>
    <Style>{style}</Style>

    <div class="building">
      <div class="header">
        <div class="title">Building the Foundation</div>
        <div class="flex">
          <div class="sub-title">Before we train our first apprentice, we must secure the organizational pillars that will support our Shasta Trades Nonprofit Organization.</div>
          <div class="hr"></div>
        </div>
      </div>

      <div class="plan">
        {steps.map(step => {
          return <>
            <div class="step">
              <div class="icon">
                <div dangerouslySetInnerHTML={{ __html: step.icon }} />
              </div>
              <div class="title">{step.title}</div>
              <div class="description">{step.description}</div>
            </div>
          </>
        })}
      </div>
    </div>
  </>
}


const style = css`
  .building {
    .header {
      margin: 0 auto;
      max-width: var(--max-width);
      padding: 0 var(--space-lite) var(--space-huge) var(--space-lite);


      .title {
        font-size: 3.2rem;
        font-weight: 700;
        color: var(--primary);
        margin-bottom: var(--space-lite);
      }

      .flex {
        display: flex;
        gap: var(--space);
        align-items: center;
        justify-content: space-between;

        .sub-title {
          color: rgb(67 72 67);
          font-family: var(--font-family-serif);;
          width: 168rem;
        }

        .hr {
          height: 1px;
          width: 100%;
          background: linear-gradient(90deg, transparent 0%, rgba(6, 27, 14, 0.1) 20%, rgba(6, 27, 14, 0.1) 80%, transparent 100%);

          @media (max-width: 600px) {
            display: none;
          }
        }
      }
    }

    .plan {
      display: flex;
      gap: var(--space);
      margin: 0 auto;
      max-width: var(--max-width);
      justify-content: space-between;
      padding: 0 var(--space-lite) var(--space-huge) var(--space-lite);

      @media (max-width: 600px) {
        flex-direction: column;
      }

      .step {
        .icon {
          width: 6.3rem;
          height: 6.3rem;
          display: flex;
          color: rgb(255 183 125);
          align-items: center;
          justify-content: center;
          border-radius: calc(var(--radius) * 2);
          background-color: var(--primary);
          margin: 0 auto;
        }

        .title {
          font-weight: 600;
          text-align: center;
          margin: var(--space-lite) 0;
        }

        .description {
          color: rgb(67 72 67);
          font-family: var(--font-family-serif);
        }
      }
    }
  }
`


export default Building
