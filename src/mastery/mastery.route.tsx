// app/src/mastery/mastery.route.tsx

import { Hono } from 'hono'
import { Style } from 'hono/css'
import { md2html } from '@src/md/md2html'
import { mdStyle } from '@src/md/mdStyle'
import { subPageHeroStyle } from '@src/lib/subPageHeroStyle'
import mdStudyGuide2025 from '@src/mastery/studyGuide2025.md?raw'
import mdYoutubeUniversity from '@src/mastery/youtubeUniversity.md?raw'


const app = new Hono()

app.get('/:id?', async (c) => {
  const paramId = c.req.param('id') ?? documents[0].id
  const current = documents.find(b => b.id === paramId)
  const html = current ? await md2html(current.md, current.wrapTables) : ''

  return c.render(
    <>
      <Style>{mdStyle}</Style>
      <Style>{subPageHeroStyle}</Style>

      <div class="mastery">
        <div class="sub-page-hero">
          <div class="bg"></div>
          <div class="header">
            <h1>Mastery</h1>
            <div class="sub-title">A public knowledge base designed to help aspiring tradespeople obtain and maintain mastery!</div>
          </div>

          <div class="buttons">
            {documents.map((a, i) => <a class={paramId === a.id ? 'active' : ''} href={'/mastery/' + a.id}>{a.title}</a>)}
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
  { id: 'youtube-university', title: 'Youtube University', md: mdYoutubeUniversity, wrapTables: false },
  { id: '2025-class-b-study-guide', title: '2025 Class B Study Guide', md: mdStudyGuide2025, wrapTables: false },
]


export default app
