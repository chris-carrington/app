// app/src/lib/transparency.route.tsx

import { Hono } from 'hono'
import { css, Style } from 'hono/css'
import { urlBE } from '@src/url/urlBE'
import { md2html } from '@src/md/md2html'
import { mdStyle } from '@src/md/mdStyle'
import { formStyle } from '@src/lib/formStyle'
import schema from '@src/transparency/schema.md?raw'
import byLaws from '@src/transparency/bylaws.md?raw'
import { subPageHeroStyle } from '@src/lib/subPageHeroStyle'
import trustDocument from '@src/transparency/trust-document.md?raw'
import whistleblowerPolicy from '@src/transparency/whistleblower-policy.md?raw'
import articlesOfIncorporation from '@src/transparency/articles-of-incorporation.md?raw'
import conflictOfInterestPolicy from '@src/transparency/conflict-of-interest-policy.md?raw'


export default new Hono()
  .get('/:id?', async (c) => {
    const url = urlBE()
    const paramId = c.req.param('id') ?? documents[0].id
    const current = documents.find(b => b.id === paramId) ?? documents[0]
    const html = await md2html(current.md, current.wrapTables)

    return c.render(
      <>
        <title>Shasta Trades · Transparency · {current.title}</title>
        <Style>{style}</Style>
        <Style>{mdStyle}</Style>
        <Style>{formStyle}</Style>
        <Style>{subPageHeroStyle}</Style>

        <div class="transparency">
          <div class="sub-page-hero">
            <div class="bg"></div>
            <div class="header">
              <h1>Transparency</h1>
              <div class="sub-title">These documents keep us focused, remind us why we exist and show all that Shasta Trades is organized, mission focused, and transparent.</div>
            </div>

            <div class="buttons">
              {documents.map((a, i) => <a class={paramId === a.id ? 'orange big' : 'transparent big'} href={url.transparency[':id?'].$url({param: {id: a.id}}).href}>{a.title}</a>)}
            </div>
          </div>

          <div class="md">
            <div dangerouslySetInnerHTML={{ __html: html }}></div>
          </div>
        </div>
      </>
    )
  })


const documents = [
  { id: 'trust-document', title: 'Trust Document', md: trustDocument, wrapTables: false },
  { id: 'bylaws', title: 'Bylaws', md: byLaws, wrapTables: false },
  { id: 'articles-of-incorporation', title: 'Articles of Incorporation', md: articlesOfIncorporation, wrapTables: false },
  { id: 'conflict-of-interest-policy', title: 'Conflict of Interest Policy', md: conflictOfInterestPolicy, wrapTables: false },
  { id: 'whistleblower-policy', title: 'Whistleblower Policy', md: whistleblowerPolicy, wrapTables: false },
  { id: 'schema', title: 'Schema', md: schema, wrapTables: true },
]


const style = css`
  .sub-page-hero .big {
    padding: var(--space-lite) 2.1rem;
  }
`
