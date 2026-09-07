// app/src/md/mdAccordion.directive.ts

import { query } from '@hono-dom'


export default (el: HTMLDivElement) => {
  const elItems = query<HTMLDivElement>('.accordion-item').root(el).many()

  for (const elItem of elItems) {
    const header = query<HTMLDivElement>('.accordion-header').root(elItem).one()
    const body = query<HTMLDivElement>('.accordion-body').root(elItem).one()

    const toggle = () => {
      const isOpen = elItem.classList.contains('open')

      if (isOpen) { // Close: set height to 0
        body.style.height = '0px'
        elItem.classList.remove('open')
        header.setAttribute('aria-expanded', 'false')
      } else { // Open: first set height to auto to get scrollHeight, then animate to that value
        body.style.height = 'auto'
        const height = body.scrollHeight
        body.style.height = '0px'

        requestAnimationFrame(() => { // Force reflow then set to target height
          body.style.height = height + 'px'
        })

        elItem.classList.add('open')
        header.setAttribute('aria-expanded', 'true')
      }
    }

    // Click toggles
    header.addEventListener('click', toggle)

    // Keyboard support (Enter/Space)
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggle()
      }
    })

    // Initialize height for items that start open
    if (elItem.classList.contains('open')) {
      requestAnimationFrame(() => { // After rendering, set height to scrollHeight
        body.style.height = 'auto'
        const height = body.scrollHeight
        body.style.height = height + 'px'
      })

      header.setAttribute('aria-expanded', 'true')
    } else {
      body.style.height = '0px'
      header.setAttribute('aria-expanded', 'false')
    }
  }
}
