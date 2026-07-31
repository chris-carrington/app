// app/src/faq/FAQ.tsx

import type{ FC } from 'hono/jsx'
import { css, Style } from 'hono/css'
import { faq } from '@hono-directives'

type FAQItem = {
  question: string
  answer: string,
}

const FAQ: FC<{ items: FAQItem[] }> = ({ items }) => {
  const style = css`
    .faq-answer-closed { display: none; }
    .faq-answer-open { display: block; }
    .faq-question { cursor: pointer; padding: 0.5rem; background: #f0f0f0; }
    .faq-question.faq-open { background: #e0e0e0; }
  `

  return <>
    <Style>{style}</Style>

    <div class="faq-container">
      {items.map((item, index) => <>
        <div class="faq-item">
          <div class="faq-question" data-directive={faq(index)}>{item.question}</div>
          <div class="faq-answer faq-answer-closed">
            {item.answer}
          </div>
        </div>
      </>)}
    </div>
  </>
}

export default FAQ
