// app/src/lib/pdf.route.tsx

import { Hono } from 'hono'
import { css, Style } from 'hono/css'
import { md2html } from '@src/md/md2html'
import { mdStyle } from '@src/md/mdStyle'
import RendererHead from '@src/renderer/RendererHead'

import bylaws from '@src/transparency/bylaws.md?raw'
// import trustDocument from '@src/transparency/trust-document.md?raw'


export default new Hono()
  .get('/', async (c) => {
    const html = await md2html(bylaws, false)
    // const html = await md2html(trustDocument, false)

    return c.html(
      <>
        <html>
          <head>
            <RendererHead />
            <Style>{mdStyle}</Style>
            <Style>{style}</Style>
          </head>

          <body>
            <main>
              <div dangerouslySetInnerHTML={{ __html: html }} class="md pdf"></div>
            </main>
          </body>
        </html>
      </>
    )
  })


const style = css`
  body {
    padding-top: var(--space);
  }

  .pdf {
    margin: 0 auto;
    max-width: var(--max-width);
  }  
`
