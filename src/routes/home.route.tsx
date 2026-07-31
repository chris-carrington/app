import { Hono } from 'hono'
import FAQ from '@src/faq/FAQ'
import { marked } from 'marked'
import { counterSolid, counterVanilla } from '@hono-directives'


const app = new Hono()

app.get('/', async (c) => {
//   const faqItems = [
//     { question: 'What is this?', answer: 'This is a FAQ.' },
//     { question: 'How does it work?', answer: 'With directives and Solid.' },
//   ]

//   const html = await marked.parse(`# Marked in Hono

// | Month    | Savings |
// | -------- | ------- |
// | January  | $250    |
// | February | $80     |
// | March    | $420    |
// `)

  return c.render(
    <>
      <h1>Home!</h1>
      {/* <div data-directive={counterSolid()}></div>
      <button data-directive={counterVanilla()} type="button"></button>
      <FAQ items={faqItems} />
      <div dangerouslySetInnerHTML={{__html: html}} /> */}
    </>
  )
})

export default app
