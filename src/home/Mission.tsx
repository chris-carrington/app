// app/src/lib/Mission.tsx

import type{ FC } from 'hono/jsx'
import { css, Style } from 'hono/css'


const Mission: FC = () => {
  return <>
    <Style>{style}</Style>

    <div class="mission">
      <div class="key">OUR MISSION</div>
      <div class="value">To help students become licensed contractors through paid apprenticeships, to offer mentors work they love, and to provide affordable, high-quality trade services, to our lovely Mount Shasta community. 💚</div>
    </div>
  </>
}


const style = css`
  .mission {
    text-align: center;
    max-width: var(--max-width);
    margin: var(--space-huge) auto;

    .key {
      font-weight: 600;
      color: rgb(144 77 0);
      margin-bottom: var(--space);
    }

    .value {
      color: rgb(6 27 14);
    }
  }

  .hr {
    height: 1px;
    width: 100%;
    margin-bottom: var(--space-huge);
    background: linear-gradient(90deg, transparent 0%, rgba(6, 27, 14, 0.1) 20%, rgba(6, 27, 14, 0.1) 80%, transparent 100%);
  }
`


export default Mission
