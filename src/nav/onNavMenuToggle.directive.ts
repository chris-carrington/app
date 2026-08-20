// app/src/nav/onNavMenuToggle.directive.ts

import { urlFE } from '@src/url/urlFE'


export default (el: HTMLButtonElement, id: string) => {
  const menu = document.getElementById(id)

  el.addEventListener('click', async () => {
    if (!menu) throw new Error('!menu')

    menu.classList.toggle('hidden')

    if (menu.classList.contains('hidden')) setTimeout(() => menu.dataset.auth = 'undefined', 600)
    else {
      const response = await urlFE().api.session.$get({query: { includePersonAndContact: 'false' }})
      const json = await response.json()
      menu.dataset.auth = String('Session' in json)
    }
  })
}
