// app/src/nav/onNavModalToggle.directive.ts

import { query } from '@hono-dom'
import { createRPC } from '@hono-api/fe'
import type { AppType } from '@src/index'
import { datasetAuth } from '@src/lib/dom'


export default (el: HTMLButtonElement, id: string) => {
  const rpc = createRPC<AppType>()
  const authDataset = datasetAuth()
  const modal = query<HTMLDivElement>(`#${id}`).one()

  el.addEventListener('click', async () => {
    modal.classList.toggle('hidden')

    if (modal.classList.contains('hidden')) setTimeout(() => modal.dataset.auth = 'undefined', 600)
    else {
      const response = await rpc.api.session[':variant?'].$get({ param: { variant: 'just-session' } })
      const res = await response.json()
      modal.dataset[authDataset.camel] = res.success ? 'true' : 'false'
    }
  })
}
