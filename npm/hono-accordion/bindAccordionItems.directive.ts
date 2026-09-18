// app/npm/hono-accordion/bindAccordionItems.directive.ts

import { query } from '@hono-dom'


/**
 * - Per-header context, keyed by the header element itself
 * - WeakMap so entries are GC'd when the header is removed from the DOM
 */
const contexts = new WeakMap<HTMLDivElement, AccordionContext>()


export default (el: HTMLDivElement) => {
  const elItems = query<HTMLDivElement>('.accordion-item').root(el).many()

  for (const elItem of elItems) {
    const header = query<HTMLDivElement>('.accordion-header').root(elItem).one()
    const body = query<HTMLDivElement>('.accordion-body').root(elItem).one()

    contexts.set(header, { elItem, header, body })

    // Idempotent: same fn references, so removing first is safe
    header.removeEventListener('click', onClick)
    header.removeEventListener('keydown', onKeydown)

    header.addEventListener('click', onClick)
    header.addEventListener('keydown', onKeydown)

    // Initial state
    if (elItem.classList.contains('open')) {
      header.setAttribute('aria-expanded', 'true')

      requestAnimationFrame(() => {
        body.style.height = 'auto'
        body.style.height = body.scrollHeight + 'px'
      })
    } else {
      header.setAttribute('aria-expanded', 'false')
      body.style.height = '0px'
    }
  }
}


function onClick(e: PointerEvent) {
  const header = e.currentTarget as HTMLDivElement
  const ctx = contexts.get(header)
  if (ctx) toggle(ctx)
}


function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Enter' && e.key !== ' ') return

  e.preventDefault()

  const header = e.currentTarget as HTMLDivElement
  const ctx = contexts.get(header)
  if (ctx) toggle(ctx)
}


function toggle({ elItem, header, body }: AccordionContext) {
  const isOpen = elItem.classList.contains('open')

  if (isOpen) {
    body.style.height = '0px'
    elItem.classList.remove('open')
    header.setAttribute('aria-expanded', 'false')
  } else {
    body.style.height = 'auto'
    const height = body.scrollHeight
    body.style.height = '0px'

    requestAnimationFrame(() => {
      body.style.height = height + 'px'
    })

    elItem.classList.add('open')
    header.setAttribute('aria-expanded', 'true')
  }
}


type AccordionContext = {
  elItem: HTMLDivElement
  header: HTMLDivElement
  body: HTMLDivElement
}
