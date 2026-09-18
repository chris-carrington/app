// app/src/transparency/queryTransparency.ts

import { md2html } from '@src/md/md2html'
import { dsTransparencyMarkdowns, dsTransparencyMarkdownsDefault, type DsTransparencyMarkdowns } from '@src/dataStructures/transparencyMarkdowns.ds'


export async function queryTransparency(id?: string) {
  const verifiedMarkdown = id
    ? dsTransparencyMarkdowns.find(v => v.id === id) ?? dsTransparencyMarkdownsDefault
    : dsTransparencyMarkdownsDefault

  const html = await getHtml(verifiedMarkdown)

  return {
    html,
    title: verifiedMarkdown.title,
    verifiedId: verifiedMarkdown.id,
  }
}


async function getHtml(doc: DsTransparencyMarkdowns) {
  return (Array.isArray(doc.md))
    ? (await Promise.all(doc.md.map(async md => await md2html(md, doc)))).join('')
    : await md2html(doc.md, doc)
}
