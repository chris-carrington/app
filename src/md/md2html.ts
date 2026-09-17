// app/src/lib/md2html.ts

import { Marked, type Tokens } from 'marked'


/**
 * Receives a markdown string and gives back an html string
 * @param md Markdown string
 * @param options.wrapTables Optional, defaults to `false`, wrap tables in a responsive container
 * @param options.enableAccordion Optional, defaults to `false`, enable accordion sections
 * @example
  ```md
  <!--{"accordionStart":true, "startOpen": true}-->
  # Section 1
  <!--{"accordionBody":true}-->
  - A
  - B
  - C
  <!--{"accordionEnd":true}-->

  <!--{"accordionStart":true}-->
  # Section 2
  <!--{"accordionBody":true}-->
  - A
  - B
  - C
  <!--{"accordionEnd":true}-->
  ```
 */
export async function md2html(md: string, options?: { wrapTables?: boolean, enableAccordion?: boolean }) {
  const marked = new Marked()

  if (options?.wrapTables) onWrapTables(marked)

  return options?.enableAccordion
    ? await onAccordion(marked, md) // convert accordion comments to html and also do md to html
    : await marked.parse(md) // md to html
}



function onWrapTables(marked: Marked) {
  marked.use({ // wrap table w/ .responsive div
    renderer: {
      table(token: Tokens.Table) {
        const headerHtml = token.header
          .map((cell) => `<th>${this.parser.parseInline(cell.tokens)}</th>`)
          .join('')

        const bodyHtml = token.rows
          .map((tableCells) => {
            const strTableCells = tableCells
              .map((cell) => `<td>${this.parser.parseInline(cell.tokens)}</td>`)
              .join('')

            return `<tr>${strTableCells}</tr>`
          })
          .join('')

        const tableHtml = `
          <table>
            <thead><tr>${headerHtml}</tr></thead>
            <tbody>${bodyHtml}</tbody>
          </table>
        `

        return `<div class="responsive">${tableHtml}</div>`
      }
    }
  })
}



async function onAccordion(marked: Marked, md: string) {
  let processedMd = md

  const accordionData: { startOpen: boolean; headerMd: string; bodyMd: string }[] = []

  // regex to match accordion comment blocks, the "startOpen" attribute is optional, defaults to false, matches:
  //   <!--{"accordionStart":true, "startOpen": true}--> ... <!--{"accordionBody":true}--> ... <!--{"accordionEnd":true}-->
  const accordionRegex = /<!--\{"accordionStart":true(?:, "startOpen": (true|false))?\}-->([\s\S]*?)<!--\{"accordionBody":true\}-->([\s\S]*?)<!--\{"accordionEnd":true\}-->/g

  let index = 0

  processedMd = md.replace(accordionRegex, (match, startOpenStr, headerMd, bodyMd) => {
    const startOpen = startOpenStr === 'true' ? true : false

    accordionData.push({
      startOpen,
      headerMd: headerMd.trim(),
      bodyMd: bodyMd.trim(),
    })

    const placeholder = `<!--ACCORDION_PLACEHOLDER_${index}-->`
    index++
    return placeholder
  })

  // render the main markdown (with placeholders)
  let html = await marked.parse(processedMd)

  // replace placeholders with accordion HTML
  for (let i = 0; i < accordionData.length; i++) {
    const { startOpen, headerMd, bodyMd } = accordionData[i]

    // render header and body separately (they can contain markdown)
    const headerHtml = await marked.parse(headerMd)
    const bodyHtml = await marked.parse(bodyMd)

    const accordionHtml = getAccordionItemHtml(i, startOpen, headerHtml, bodyHtml)
    html = html.replace(`<!--ACCORDION_PLACEHOLDER_${i}-->`, accordionHtml)
  }

  return html
}



function getAccordionItemHtml(index: number, startOpen: boolean, headerHtml: string, bodyHtml: string): string {
  const openClass = startOpen ? 'open' : ''
  const expanded = startOpen ? 'true' : 'false'
  const bodyId = `accordion-body-${index}`
  const headerId = `accordion-header-${index}`

  return `
<div class="accordion-item ${openClass}" data-accordion-index="${index}">
  <div class="accordion-header" id="${headerId}" role="button" tabindex="0" aria-expanded="${expanded}" aria-controls="${bodyId}">
    <img src="/img/chevron.svg" class="accordion-chevron" alt="" aria-hidden="true">
    <div class="accordion-title">${headerHtml}</div>
  </div>
  <div class="accordion-body" id="${bodyId}" role="region" aria-labelledby="${headerId}" style="height: 0; overflow: hidden; transition: height 0.3s ease;">
    ${bodyHtml}
  </div>
</div>
  `
}
