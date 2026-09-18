// app/npm/hono-modal/onModalToggle.directive.ts

import { toggleModalDom } from './toggleModalDom'


export default (el: HTMLButtonElement, id: string) => {
  const modal = document.getElementById(id)

  el.addEventListener('click', async () => {
    if (!modal) throw new Error('!modal')
    toggleModalDom(modal)
  })
}
