// app/src/lib/Forms.tsx

import type{ FC } from 'hono/jsx'
import { css, Style } from 'hono/css'


const Forms: FC = () => {
  return <>
    <Style>{style}</Style>

    <div class="forms">
      <div class="bg" />
    </div>
  </>
}


const style = css`
  .forms {
    width: 100%;
    min-height: 54rem;
    margin-bottom: var(--space-huge);
    background-color: rgb(27 48 34);
    position: relative;

    .bg {
      position: absolute;
      inset: 0;
      opacity: 0.1;
      background-image: url(/wood-pattern.webp);
    }
  }
`


export default Forms
