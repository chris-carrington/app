// app/src/home/hash/onHomeHashClick.directive.ts

import { query } from '@hono-dom'
import { parseHash, updateDOM } from './updateDOM'
import { datasetScroll, idHomeForm } from '@src/lib/dom'


export default (_: HTMLDivElement) => {
  const scrollDataset = datasetScroll()
  const root = query(idHomeForm().query).one()
  const anchors = query<HTMLAnchorElement>(scrollDataset.query()).all()

  for (const anchor of anchors) {
    const scroll = anchor.dataset[scrollDataset.camel] === 'true'

    anchor.addEventListener('click', (event: MouseEvent) => {
      // Respect the browser for modifiers / non-primary buttons (new tab, etc.).
      if (event.defaultPrevented) return
      if (event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const id = parseHash(anchor.hash)
      if (!id) return

      event.preventDefault()

      // Change the URL without adding a history entry and without triggering
      // the browser's native hash scroll. replaceState does NOT fire
      // hashchange, so we drive the DOM ourselves below.
      history.replaceState(history.state, '', `#${id}`)

      updateDOM(root, id, { scroll })
    })
  }
}
