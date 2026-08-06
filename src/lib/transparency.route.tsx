// app/src/lib/transparency.route.tsx

import { Hono } from 'hono'
import { css, Style } from 'hono/css'
import { marked, Tokens } from 'marked'
import schema from '@src/md/schema.md?raw'


const app = new Hono()


app.get('/', async (c) => {
  marked.use({
    renderer: {
      table: (token: Tokens.Table) => {
        const headerHtml = token.header
          .map(cell => `<th>${cell.text}</th>`)
          .join('')

        const bodyHtml = token.rows
          .map(row => `<tr>${row.map(cell => `<td>${cell.text}</td>`).join('')}</tr>`)
          .join('')

        const tableHtml = `
          <table>
            <thead><tr>${headerHtml}</tr></thead>
            <tbody>${bodyHtml}</tbody>
          </table>
        `

        return `<div class="responsive">${tableHtml}</div>` // wrap in a responsive container
      }
    }
  })

  const htmlSchema = await marked.parse(schema)

  const buttons = [
    { href: '#schema', title: 'Schema' },
    { href: '#trust-document', title: 'Trust Document' },
    { href: '#bylaws', title: 'Bylaws' },
    { href: '#articles-of-incorporation', title: 'Articles of Incorporation' },
    { href: '#conflict-of-interest-policy', title: 'Conflict of Interest Policy' },
    { href: '#whistleblower', title: 'Whistleblower Policy' },
    { href: '#nine-ninety', title: 'Form 990' },
  ]

  return c.render(
    <>
      <Style>{style}</Style>

      <div class="transparency">
        <div class="header">
          <h1>Transparency</h1>
          <div class="flex">
            <div class="sub-title">We believe trust is built by sharing everything (our challenges, our successes, and our commitments). This Transparency page is our promise to you that Shasta Trades will always operate with <strong>honesty</strong>, <strong>accountability</strong>, and an <strong>open heart</strong>.</div>
            <div class="hr"></div>
          </div>
        </div>

        <div class="buttons">
          {buttons.map((a, i) => <a class={i === 0 ? 'active' : ''} href={a.href}>{a.title}</a>)}
        </div>

        <div class="schema">
          <div dangerouslySetInnerHTML={{ __html: htmlSchema }}></div>
        </div>
      </div>
    </>
  )
})


const style = css`
  .transparency {
    margin: 0 auto;
    max-width: var(--max-width);
    padding: var(--space) var(--space-lite) var(--space-huge) var(--space-lite);

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

    .header {
      margin: 0 auto;
      max-width: var(--max-width);
      padding: 0 var(--space-lite) var(--space-huge) var(--space-lite);

      h1 {
        font-size: 3.2rem;
        font-weight: 700;
        color: var(--primary);
        margin-bottom: var(--space-lite);
      }

      .flex {
        display: flex;
        gap: var(--space);
        align-items: center;
        justify-content: space-between;

        .sub-title {
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
      margin-bottom: var(--space-huge);

      a,
      button {
        font-weight: 600;
        font-size: 1.71rem;
        text-decoration: none;
        border-radius: calc(var(--radius) * 2);
        padding: var(--space-lite) var(--space);
        border: 1px solid #dee2e6;
        background-color: transparent;
        cursor: pointer;
        transition: all 0.3s;
        color: var(--primary);
        &:hover {
          scale: 1.02;
          background-color: rgb(255 255 255 / 0.1);
        }
        &.active {
          color: var(--white);
          background-color: var(--primary);
          border-color: var(--primary);
          &:hover {
            cursor: default;
          }
        }
      }
    }

    .schema {

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
          margin-bottom: 1rem;
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
