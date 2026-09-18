// app/src/lib/transparency.route.tsx

import { Hono } from 'hono'
import { css, Style } from 'hono/css'
import { createRPC } from '@hono-api/be'
import { md2html } from '@src/md/md2html'
import { mdStyle } from '@src/md/mdStyle'
import type { AppType } from '@src/index'
import svgDownload from '@src/svg/download.svg?raw'
import { subPageHeroStyle } from '@src/lib/subPageHeroStyle'
import { dsTransparencyMarkdowns, dsTransparencyMarkdownsDefault, type DsTransparencyMarkdowns } from '@src/dataStructures/transparencyMarkdowns.ds'
import { bindAccordionItems } from '@hono-directives'


export default new Hono()
  .get('/:id?', async (c) => {
    const rpc = createRPC<AppType>()
    const paramId = c.req.param('id') ?? dsTransparencyMarkdownsDefault.id
    const current = dsTransparencyMarkdowns.find(b => b.id === paramId) ?? dsTransparencyMarkdownsDefault
    const html = await getHtml(current)

    return c.render(
      <>
        <title>Shasta Trades · Transparency · {current.title}</title>
        <Style>{style}</Style>
        <Style>{mdStyle}</Style>
        <Style>{subPageHeroStyle}</Style>

        <div data-directive={bindAccordionItems()} class="transparency">
          <div class="sub-page-hero">
            <div class="bg"></div>
            <div class="header">
              <h1>Transparency</h1>
              <div class="sub-title">These documents keep us focused, remind us why we exist and show all that Shasta Trades is organized, mission focused, and transparent.</div>
            </div>

            <div class="buttons">
              {dsTransparencyMarkdowns.map(a => <a class={paramId === a.id ? 'orange big' : 'transparent big'} href={rpc.transparency[':id?'].$url({param: {id: a.id}}).href}>{a.title}</a>)}
            </div>
          </div>

          <div class="md">
            <div dangerouslySetInnerHTML={{ __html: html }}></div>
          </div>

          {
            current.id !== 'schema' && <>
              <div class="download">
                <a href={`https://github.com/chris-carrington/app/blob/main/src/transparency/${current.id}.md`} target="_blank" class="orange big">View on GitHub</a>
                <a href={`/pdf/${current.id}.pdf`} download={`${current.id}.pdf`} class="primary big">
                  <span dangerouslySetInnerHTML={{ __html: svgDownload }} class="svg"></span>
                  <span>Download {current.title} as PDF</span>
                </a>
              </div>
            </>
          }
        </div>
      </>
    )
  })


async function getHtml(doc: DsTransparencyMarkdowns) {
  return (Array.isArray(doc.md))
    ? (await Promise.all(doc.md.map(async md => await md2html(md, doc)))).join('')
    : await md2html(doc.md, doc)
}


const style = css`
  .sub-page-hero .big {
    padding: var(--space-lite) 2.1rem;
  }

  .download {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: var(--space);
    margin-bottom: var(--space);

    .primary {
      display: flex;
      align-items: center;
      gap: var(--space-lite);

      .svg {
        height: 2.4rem;

        svg {
          width: 2.4rem;
          height: 2.4rem;
        }
      }
    }
  }
`
