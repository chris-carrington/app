// app/src/home/hash/updateDOM.ts

import { query } from '@hono-dom'
import { safeArrayAccess } from '@safely-access'
import { dsHomeFormIds } from '@src/dataStructures/homeForms.ds'

export const defaultHashKey = safeArrayAccess(dsHomeFormIds, 0)

/** "#join-leadership" -> "join-leadership", anything else -> null */
export function parseHash(hash: string): string | null {
  if (!hash || hash === '#') return null
  const id = decodeURIComponent(hash.slice(1))
  return dsHomeFormIds.includes(id) ? id : null
}

export function updateDOM(
  root: HTMLElement,
  activeId: string,
  { scroll = true }: { scroll?: boolean } = {},
) {
  for (const id of dsHomeFormIds) {
    const form = query<HTMLDivElement>(`#${id}`).root(root).one()
    const anchor = query<HTMLAnchorElement>(`a[href="#${id}"]`).root(root).one()
    const isActive = id === activeId

    form?.classList.toggle('hidden', !isActive)
    anchor?.classList.toggle('orange', isActive)
    anchor?.classList.toggle('transparent', !isActive)

    // Scroll *after* the visibility toggle so the target is laid out.
    if (scroll && isActive) form?.scrollIntoView({ behavior: 'smooth' })
  }
}
