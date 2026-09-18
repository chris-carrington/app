// app/src/lib/transparency.route.tsx

import { Hono } from 'hono'
import { css, Style } from 'hono/css'
import { createRPC } from '@hono-api/be'
import { mdStyle } from '@src/md/mdStyle'
import type { AppType } from '@src/index'
import svgDownload from '@src/svg/download.svg?raw'
import { queryTransparency } from './queryTransparency'
import { subPageHeroStyle } from '@src/lib/subPageHeroStyle'
import { datasetId, classNameMd, idDownload } from '@src/lib/dom'
import { bindAccordionItems, onTransparencyLoad } from '@hono-directives'
import { dsTransparencyMarkdowns } from '@src/dataStructures/transparencyMarkdowns.ds'


export default new Hono()
  .get('/:id?', async (c) => {
    const idDataset = datasetId()
    const rpc = createRPC<AppType>()
    const { verifiedId, title, html } = await queryTransparency(c.req.param('id'))

    return c.render(
      <>
        <title>Shasta Trades · Transparency · {title}</title>
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

            <div data-directive={onTransparencyLoad()} class="buttons">
              {
                dsTransparencyMarkdowns.map(v => <>
                  <a {...idDataset.attr(v.id)} class={verifiedId === v.id ? 'orange big' : 'transparent big'} href={rpc.transparency[':id?'].$url({ param: { id: v.id } }).href}>{v.title}</a>
                </>)
                }
            </div>
          </div>

          <div class={classNameMd().className}>
            {
              dsTransparencyMarkdowns.map(v => <>
                <div {...idDataset.attr(v.id)} dangerouslySetInnerHTML={{ __html: v.id === verifiedId ? html : '' }}></div>
              </>)
            }
          </div>

          <div id={idDownload().id} class={`${verifiedId === 'schema' ? 'hidden' : ''}`}>
            <a href={`https://github.com/chris-carrington/app/blob/main/src/transparency/${verifiedId}.md`} target="_blank" class="orange big">View on GitHub</a>
            <a href={`/pdf/${verifiedId}.pdf`} download={`${verifiedId}.pdf`} class="primary big">
              <span dangerouslySetInnerHTML={{ __html: svgDownload }} class="svg"></span>
              <span>Download {title} as PDF</span>
            </a>
          </div>
        </div>
      </>
    )
  })



const style = css`
  .sub-page-hero .big {
    padding: var(--space-lite) 2.1rem;
  }

  #download {
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
