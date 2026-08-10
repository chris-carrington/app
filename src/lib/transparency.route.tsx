// app/src/lib/transparency.route.tsx

import { Hono } from 'hono'
import { css, Style } from 'hono/css'
import { md2html } from '@src/lib/md2html'
import schema from '@src/md/schema.md?raw'
import byLaws from '@src/md/bylaws.md?raw'
import trustDocument from '@src/md/trust-document.md?raw'
import whistleblowerPolicy from '@src/md/whistleblower-policy.md?raw'
import articlesOfIncorporation from '@src/md/articles-of-incorporation.md?raw'
import conflictOfInterestPolicy from '@src/md/conflict-of-interest-policy.md?raw'


const app = new Hono()

app.get('/:id?', async (c) => {
  const paramId = c.req.param('id') ?? documents[0].id
  const current = documents.find(b => b.id === paramId)
  const html = current ? await md2html(current.md, current.wrapTables) : ''

  return c.render(
    <>
      <Style>{style}</Style>

      <div class="transparency">
        <div class="pattern">
          <div class="bg"></div>
          <div class="header">
            <h1>Transparency</h1>
            <div class="flex">
              <div class="sub-title">We believe trust is built by sharing everything (i.e., our challenges, our successes, and our commitments). This Transparency page is our promise to you that Shasta Trades will always operate with <strong>honesty</strong>, <strong>accountability</strong>, and an <strong>open heart</strong>.</div>
              <div class="hr"></div>
            </div>
          </div>

          <div class="buttons">
            {documents.map((a, i) => <a class={paramId === a.id ? 'active' : ''} href={'/transparency/' + a.id}>{a.title}</a>)}
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
  .transparency {

    h1,
    h2 {
      margin-top: 0;
      font-weight: 700;
      color: var(--primary);
    }

    h1 {
      font-size: 3.3rem;
      margin-bottom: var(--space-lite);
    }

    h2 {
      font-size: 2.4rem;
      margin-bottom: calc(var(--space-lite) / 2);
    }

    .pattern {
      width: 100%;
      padding: var(--space) var(--space-lite) calc(var(--space) * 1.41) var(--space-lite);
      margin-bottom: var(--space-huge);
      background-color: var(--primary);
      position: relative;

      .bg {
        position: absolute;
        z-index: var(--z-mask);
        inset: 0;
        opacity: 0.1;
        background-image: url(/wood-pattern.webp);
      }

      .header,
      .buttons {
        position: relative;
        z-index: var(--z-content);
      }

      .header {
        margin: 0 auto;
        max-width: var(--max-width);
        padding: 0 var(--space-lite) var(--space) var(--space-lite);

        h1 {
          font-size: 3.2rem;
          font-weight: 700;
          color: var(--white);
          margin-bottom: var(--space-lite);
        }

        .flex {
          display: flex;
          gap: var(--space);
          align-items: center;
          justify-content: space-between;

          .sub-title {
            color: #dcdfdc;
            font-family: var(--font-family-serif);;
            width: 168rem;
          }

          .hr {
            height: 1px;
            width: 100%;
            background: linear-gradient(90deg, transparent 0%, rgba(6, 27, 14, 0.1) 20%, rgba(6, 27, 14, 0.1) 80%, transparent 100%);

            @media (max-width: 600px) {
              display: none;
            }
          }
        }
      }

      .buttons {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: var(--space-lite);

        a,
        button {
          font-weight: 600;
          font-size: 1.71rem;
          text-decoration: none;
          border-radius: calc(var(--radius) * 2);
          color: var(--white);
          padding: var(--space-lite) 2.1rem;
          border: 1px solid rgb(255 255 255 / 0.2);
          background-color: transparent;
          cursor: pointer;
          transition: all 0.3s;
          &:hover {
            scale: 1.02;
            background-color: rgb(255 255 255 / 0.1);
          }
          &.active {
            color: var(--orange-text);
            background-color: var(--orange);
            border-color: var(--orange);
            &:hover {
              cursor: default;
            }
          }
        }
      }
    }

    .md {
      margin: 0 auto;
      max-width: var(--max-width);
      padding: 0 var(--space-lite) var(--space-huge) var(--space-lite);

      p,
      ul {
        margin-top: 0;
      }

      hr {
        height: 1px;
        width: 100%;
        border: none;
        background: linear-gradient(90deg, transparent 0%, rgba(6, 27, 14, 0.1) 9%, rgba(6, 27, 14, 0.1) 91%, transparent 100%);
        margin: var(--space-huge) 0;
      }

      .responsive {
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch; // Smooth scrolling on iOS
        border-radius: var(--radius);
        border: 1px solid #dee2e6;

        table {
          width: 100%;
          color: #212529;
          background-color: #fff;
          border-collapse: separate; /* required for border-radius to work */
          border-spacing: 0; /* remove gaps between cells */

          th, td {
            padding: 0.6rem;
            vertical-align: top;
            width: 33%;
            border-top: 1px solid #dee2e6;
            border-left: 1px solid #dee2e6;
            white-space: nowrap;
            &:first-child {
              border-left: none; /* Remove left border from the very first column */
            }
          }

          tr:first-child { /* Remove top border from the very first row */
            th, td {
              border-top: none;
            }
          }

          th {
            padding: 0.9rem 0.6rem;
            text-align: left;
            border-bottom: 2px solid #dee2e6;
          }

          tbody tr:nth-of-type(odd) { /* striped rows */
            background-color: rgba(0, 0, 0, 0.05);
          }
        }
      }
    }
  }
`


export default app
