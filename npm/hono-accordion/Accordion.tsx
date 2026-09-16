// app/npm/hono-accordion/Accordion.tsx

import type { FC, Child } from 'hono/jsx'


/**
 * @param items[number].header Accordion header
 * @param items[number].body Accordion body
 * @param items[number].startOpen Optional, defaults to false, if the item should start open or not
 * @param items[number].startOpen Optional, defaults is '', helpful when there are multiple <Accordion /> components on the same page (ensure dom id's are unique)
 * @example
  ```
  <Accordion items={[
    {
      header: 'One',
      body: <strong>One</strong>,
      startOpen: true,
    },
    {
      header: 'Two',
      body: <strong>Two</strong>
    }
  ]} />  
  ```

 */
export const Accordion = (({ items }) => {
  return <>
    {
      items.map((item, i) => {
        const ns = item.namespace ?? ''

        return <>
          <div class={`accordion-item ${item.startOpen ? 'open' : ''}`} data-accordion-index={i}>
            <div class="accordion-header" id={`accordion-header-${ns}-${i}`} role="button" tabindex={0} aria-expanded={item.startOpen} aria-controls={`accordion-body-${ns}-${i}`}>
              <img src="/img/chevron.svg" class="accordion-chevron" aria-hidden="true" />
              <div class="accordion-title">{item.header}</div>
            </div>
            <div class="accordion-body" id={`accordion-body-${ns}-${i}`} role="region" aria-labelledby={`accordion-header-${ns}-${i}`}>{item.body}</div>
          </div>
        </>
      })
    }
  </>
}) satisfies FC<{ items: { header: Child, body: Child, startOpen?: boolean, namespace?: string }[] }>
