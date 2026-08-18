// app/src/lib/Mission.tsx

import type{ FC } from 'hono/jsx'
import { css, Style } from 'hono/css'


export default (() => {
  return <>
    <Style>{style}</Style>

    <div class="mission">
      <div class="key">OUR MISSION</div>
      <div class="value">To help students become licensed contractors through paid apprenticeships, to offer mentors work they love, and to provide affordable, high-quality trade services, to our lovely Mount Shasta community. 💚</div>
    </div>
  </>
}) satisfies FC


const style = css`
  .mission {
    text-align: center;
    max-width: var(--max-width);
    margin: 0 auto;
    padding: calc(var(--space-huge) / 1.8) var(--space-lite);

    .key {
      font-weight: 600;
      color: rgb(144 77 0);
      margin-bottom: var(--space-lite);
    }

    .value {
      color: rgb(6 27 14);
    }
  }
`
