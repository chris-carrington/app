// app/src/lib/md2html.ts

import { marked, type Tokens } from 'marked'


/**
 * Receives a markdown string and gives back an html string
 * @param md Markdown string
 * @param wrapTables Optional, defaults to true, will this markdown have tables in it and if so should we wrap them to allow responsive hoizontal scrolling
 */
export async function md2html(md: string, wrapTables = true) {
  if (wrapTables) {
    marked.use({ // wrap table w/ .responsive div
      renderer: {
        table (token: Tokens.Table) {
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
  
  return await marked.parse(md) // md to html
}
