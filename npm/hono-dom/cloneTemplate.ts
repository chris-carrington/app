// app/npm/hono-dom/cloneTemplate.ts

import { query } from './query'


export function cloneTemplate(q: string) {
  const template = query<HTMLTemplateElement>(q).one()
  if (!(template.content.firstElementChild instanceof HTMLDivElement)) throw new Error('!(template.content.firstElementChild instanceof HTMLDivElement)')
  return template.content.firstElementChild?.cloneNode(true) as HTMLDivElement
}
