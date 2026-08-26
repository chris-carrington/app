// app/src/objectives/onMarkdownChecked.directive.ts

import { query } from '@hono-dom'
import { md2html } from '@src/md/md2html'
import { idObjectiveAddEditModalMd, fieldObjectiveAddEditDescription } from '@src/lib/dom'


export default (el: HTMLInputElement) => {
  const elMd = query(idObjectiveAddEditModalMd().query).one()
  const elTextarea = query<HTMLTextAreaElement>(fieldObjectiveAddEditDescription().query).one()

  el.addEventListener('change', async function () {
    if (this.checked) {
      elMd.style.display = 'block'
      elTextarea.style.display = 'none'
      elMd.innerHTML = await md2html(elTextarea.value, false)
    } else {
      elMd.style.display = 'none'
      elTextarea.style.display = 'block'
    }
  })
}
