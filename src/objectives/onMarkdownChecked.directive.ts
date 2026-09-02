// app/src/objectives/onMarkdownChecked.directive.ts

import { query } from '@hono-dom'
import { md2html } from '@src/md/md2html'
import { idObjectiveInUpModalMd, fieldObjectiveInUpDescription } from '@src/lib/dom'


export default (el: HTMLInputElement) => {
  let innerHTML = ''
  let textAreaValue = ''

  const elMd = query(idObjectiveInUpModalMd().query).one()
  const elTextarea = query<HTMLTextAreaElement>(fieldObjectiveInUpDescription().query).one()

  el.addEventListener('change', async function () {
    if (this.checked) {
      elMd.style.display = 'none'
      elTextarea.style.display = 'block'
    } else {
      elMd.style.display = 'block'
      elTextarea.style.display = 'none'

      if (textAreaValue !== elTextarea.value) {
        textAreaValue = elTextarea.value
        elMd.innerHTML = innerHTML = await md2html(elTextarea.value, false)
      }
    }
  })
}
