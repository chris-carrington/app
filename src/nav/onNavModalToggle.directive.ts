// app/src/nav/onNavModalToggle.directive.ts

import { query } from '@hono-dom'
import { urlFE } from '@src/url/urlFE'


export default (el: HTMLButtonElement, id: string) => {
  const modal = query<HTMLDivElement>(`#${id}`).one()

  el.addEventListener('click', async () => {
    modal.classList.toggle('hidden')

    if (modal.classList.contains('hidden')) setTimeout(() => modal.dataset.auth = 'undefined', 600)
    else {
      const response = await urlFE().api.session.$get({query: { includePersonAndContact: 'false' }})
      const json = await response.json()
      modal.dataset.auth = String('Session' in json)
    }
  })
}
