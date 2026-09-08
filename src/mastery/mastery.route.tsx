// app/src/mastery/mastery.route.tsx

import { Hono } from 'hono'
import { Style } from 'hono/css'
import { md2html } from '@src/md/md2html'
import { mdStyle } from '@src/md/mdStyle'
import { formStyle } from '@src/lib/formStyle'
import { subPageHeroStyle } from '@src/lib/subPageHeroStyle'
import { mdAccordion, onStudyGuideLoad } from '@hono-directives'
import mdStudyGuide2025Faq from '@src/mastery/studyGuide2025Faq.md?raw'
import mdYoutubeUniversity from '@src/mastery/youtubeUniversity.md?raw'


export default new Hono()
  .get('/:id?', async (c) => {
    const paramId = c.req.param('id') ?? documents[0].id
    const current = documents.find(b => b.id === paramId) ?? documents[0]
    const html = await md2html(current.md, current)

    let subHtml = ''

    if (current.id === '2025-class-b-study-guide') {
      const subQuery = c.req.query('sub') ?? ''
      const subValidQuery = studyGuideSubs.has(subQuery) ? subQuery : 'acronyms'
      const mdSub = await import(`./studyGuide2025_${subValidQuery}.md?raw`)
      subHtml = await md2html(mdSub.default, current)
    }
    
    return c.render(
      <>
        <title>Shasta Trades · Mastery · {current.title}</title>
        <Style>{mdStyle}</Style>
        <Style>{formStyle}</Style>
        <Style>{subPageHeroStyle}</Style>

        <div class="mastery" data-directive={mdAccordion()}>
          <div class="sub-page-hero">
            <div class="bg"></div>
            <div class="header">
              <h1>Mastery</h1>
              <div class="sub-title">A public knowledge base designed to help aspiring tradespeople obtain and maintain mastery!</div>
            </div>

            <div class="buttons">
              {documents.map((a, i) => <a class={paramId === a.id ? 'orange big' : 'transparent big'} href={'/mastery/' + a.id}>{a.title}</a>)}
            </div>
          </div>

          <div class="md" data-directive={onStudyGuideLoad()}>
            <div dangerouslySetInnerHTML={{ __html: html }}></div>
            { subHtml && <div dangerouslySetInnerHTML={{ __html: subHtml }}></div> }
          </div>
        </div>
      </>
    )
  })


const documents = [
  { id: 'youtube-university', title: 'Youtube University', md: mdYoutubeUniversity, wrapTables: false, enableAccordion: true },
  { id: '2025-class-b-study-guide', title: '2025 Class B Study Guide', md: mdStudyGuide2025Faq, wrapTables: false, enableAccordion: true },
]

const studyGuideSubs = new Set([
  'acronyms',
  'random',
  'occupancy_classification',
])
