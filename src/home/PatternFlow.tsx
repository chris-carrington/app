// app/src/lib/Pattern.tsx

import type { FC } from 'hono/jsx'
import { css, Style } from 'hono/css'
import { onFlowChange, onWrapChange } from '@hono-directives'
import { dsFlowSteps } from '@src/dataStructures/flowSteps.ds'
import { classNameStep, datasetFlowStepButton, datasetFlowStepContainer } from '@src/lib/dom'


export default (() => {
  return <>
    <Style>{style}</Style>

    <div class="pattern">
      <div class="bg" />
      <Flow />
    </div>
  </>
}) satisfies FC



const Flow: FC = () => {
  const stepClassName = classNameStep()
  const datasetButton = datasetFlowStepButton()
  const datasetContainer = datasetFlowStepContainer()

  return <>
    <div class="flow" data-directive={onFlowChange()}>
      <div class="explain">🤔 How does Shasta Trades work?</div>

      <div class="buttons">
        {dsFlowSteps.map(step => <button {...datasetButton.attr(step.id)} class="transparent big" type="button">{step.button}</button>)}
      </div>

      {dsFlowSteps.map(step => <>
        <div {...datasetContainer.attr(step.id)} data-directive={onWrapChange()} class="steps hidden">
          <div class="line"></div>

          {step.steps.map((s, i) => <>
            <div class={stepClassName.className}>
              <div class="count">{i+1}</div>
              <div class="icon" dangerouslySetInnerHTML={{ __html: s.icon }}></div>
              <div class="title">{s.title}</div>
              <div class="description" dangerouslySetInnerHTML={{ __html: s.description }} />
            </div>
          </>)}
        </div>
      </>)}
    </div>
  </>
}



const style = css`
  .pattern {
    width: 100%;
    background-color: var(--primary);
    position: relative;

    .bg {
      position: absolute;
      z-index: var(--z-mask);
      inset: 0;
      opacity: 0.1;
      background-image: url(/img/wood-pattern.webp);
    }

    .hr {
      height: 0.2rem;
      width: 100%;
      background: linear-gradient(90deg, transparent 0%, rgba(194, 194, 193, 0.1) 50%, transparent 100%);
    }

    .explain {
      text-align: center;
      color: var(--white);
      opacity: 0.72;
      filter: grayscale(1);
      font-weight: 600;
      margin-bottom: var(--space-lite);
      font-size: 2.01rem;
    }

    .buttons {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: var(--space-lite);
      margin-bottom: var(--space);
    }

    .flow,
    .forms {
      position: relative;
      z-index: var(--z-content);
      margin: 0 auto;
      max-width: var(--max-width);
      padding: var(--space-huge) var(--space-lite);
    }

    .forms {

      .form {
        scroll-margin-top: 24rem;

        @media (max-width: 927px) {
          scroll-margin-top: 28.2rem;
        }

        @media (max-width: 498px) {
          scroll-margin-top: 36rem;
        }

        @media (max-width: 456px) {
          scroll-margin-top: 42.9rem;
        }

        .badge {
          text-align: center;
          display: inline-block;
          color: rgb(255 220 195);
          background-color: rgb(144 77 0 / 0.1);
          border: 1px solid rgb(144 77 0 / 0.2);
          padding: calc(var(--space-lite) / 2) var(--space-lite);
          border-radius: var(--radius);
          margin-bottom: var(--space-lite);

          @media (max-width: 1100px) {
            display: none;
          }
        }

        .flex {
          display: flex;
          gap: var(--space-huge);

          @media (max-width: 1100px) {
            flex-direction: column;
          }

          .left,
          .right {
            width: 50%;
            max-width: 50%;

            @media (max-width: 1100px) {
              width: 100%;
              max-width: 100%;
            }
          }

          .left {
            .title {
              color: var(--white);
              font-weight: 600;
              font-size: 4.8rem;
            }

            .description {
              color: rgb(180 205 184);
              margin-bottom: var(--space);
            }

            .items {
              max-height: 47.1rem;
              overflow: auto;
              -ms-overflow-style: none;  /* IE and Edge */
              scrollbar-width: none;     /* Firefox */
              &::-webkit-scrollbar {
                display: none;           /* Chrome, Safari, and Opera */
              }

              .item {
                padding: var(--space-lite);
                margin-bottom: var(--space-lite);
                display: flex;
                align-items: center;
                gap: var(--space-lite);
                background-color: rgb(255 255 255 / 0.05);
                border-radius: calc(var(--radius) * 3);
                border: 1px solid rgba(255, 255, 255, 0.1);
                &:last-child {
                  margin-bottom: 0;
                }

                .icon {
                  color: rgb(255 220 195);
                }

                .info {
                  .primary {
                    color: var(--white);
                    font-weight: 600;
                  }

                  .secondary {
                    color: rgb(180 205 184);
                    font-size: 1.86rem;
                  }
                }
              }
            }
          }

          .right {
            position: relative;
            width: 100%;
            border-radius: calc(var(--radius) * 3);
            border: 1px solid rgba(255, 255, 255, 0.1);
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
              font-weight: 600;
              font-size: 1.86rem;
              margin-bottom: var(--space-lite);
            }

            fieldset {
              padding: 0;
              border: none;
            }

            .inputs {
              padding: var(--space);
              position: relative;
              z-index: var(--z-content);

              .field:not(.checkboxes) {

                label {
                  display: none;
                }
              }
            }
          }
        }
      }
    }

    .flow {
      .steps {
        display: flex;
        justify-content: center;
        align-items: start;
        flex-wrap: wrap;
        gap: var(--space);
        position: relative;
        &.wrapped .line {
          display: none;
        }
        &.wrapped .step .count {
          display: flex;
        }

        .line {
          height: 0.3rem;
          position: absolute;
          z-index: var(--z-mask);
          top: 3.15rem;
          background: linear-gradient(90deg, transparent 0%, #fe932c 50%, transparent 100%);
          background-size: 200% 100%;
          animation: flow-line 6s linear infinite;
          width: calc((var(--steps) - 1) / var(--steps) * (100% + var(--space)));
        }

        .step {
          flex: 1;
          position: relative;
          z-index: var(--z-content);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 1.86rem;
          min-width: 18rem;

          .count {
            display: none;
            position: absolute;
            top: 0;
            transform: translate(-1.2rem, -0.99rem);
            background-color: var(--orange);
            color: #181818;
            border-radius: 50%;
            align-items: center;
            justify-content: center;
            width: 2.1rem;
            height: 2.1rem;
            opacity: 0.3;
          }

          .icon {
            width: 6.3rem;
            height: 6.3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            color: var(--orange);
            background-color: var(--primary);
            margin-bottom: var(--space-lite);
            box-shadow: 0 0 #0000, 0 0 #0000, 0 0 #0000, 0 0 20px rgba(254, 147, 44, 0.3);

            svg {
              width: 2.7rem;
              height: 2.7rem;
            }
          }

          .title {
            color: white;
            font-weight: 600;
            margin-bottom: calc(var(--space-lite) / 4);
          }

          .description {
            color: rgb(180 205 184);

            a {
              color: var(--orange);
              text-decoration: none;
              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
      }
    }
  }

  @keyframes flow-line {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: 0 0;
    }
  }
`
