// app/src/mastery/mastery.route.tsx

import { Hono } from 'hono'
import { Style } from 'hono/css'
import { md2html } from '@src/md/md2html'
import { mdStyle } from '@src/md/mdStyle'
import { Tab, Tabs, tabsStyle } from '@hono-tabs'
import { queryStudyGuide } from './queryStudyGuide'
import { subPageHeroStyle } from '@src/lib/subPageHeroStyle'
import { bindAccordionItems, onStudyGuideLoad } from '@hono-directives'
import mdStudyGuide2025Faq from '@src/mastery/studyGuide2025Faq.md?raw'
import mdYoutubeUniversity from '@src/mastery/youtubeUniversity.md?raw'


export default new Hono()
  .get('/:id?', async (c) => {
    const paramId = c.req.param('id') ?? defaultDocument.id
    const current = documents.find(b => b.id === paramId) ?? defaultDocument
    const html = await md2html(current.md, current)

    let subHtml = ''
    let subVerifiedIdQuery = ''

    if (current.id === '2025-class-b-study-guide') {
      const { verifiedId, html } = await queryStudyGuide(c.req.query('sub'))
      subVerifiedIdQuery = verifiedId
      subHtml = html
    }

    return c.render(
      <>
        <title>Shasta Trades · Mastery · {current.title}</title>
        <Style>{mdStyle}</Style>
        <Style>{tabsStyle}</Style>
        <Style>{subPageHeroStyle}</Style>

        <div class="mastery" data-directive={bindAccordionItems()}>
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

            <Tabs variant="underline" name="study-guide-tabs" tabs={[
              createTab('acronyms', 'Acronyms', subHtml, subVerifiedIdQuery),
              createTab('random', 'Random', subHtml, subVerifiedIdQuery),
              createTab('occupancy_classification', 'Occupancy Classification', subHtml, subVerifiedIdQuery),
            ]} />
          </div>
        </div>
      </>
    )
  })


const defaultDocument = { id: 'youtube-university', title: 'Youtube University', md: mdYoutubeUniversity, wrapTables: false, enableAccordion: true }


const documents = [
  defaultDocument,
  { id: '2025-class-b-study-guide', title: '2025 Class B Study Guide', md: mdStudyGuide2025Faq, wrapTables: false, enableAccordion: true },
]


function createTab(id: string, label: string, html: string, subVerifiedIdQuery: string): Tab {
  return {
    id,
    label,
    isInitiallyActive: subVerifiedIdQuery === id,
    content: <div
      style="min-height: 35rem"
      id={'tabs-content-' + id}
      dangerouslySetInnerHTML={{ __html: subVerifiedIdQuery === id ? html : '' }}></div>
  }
}
