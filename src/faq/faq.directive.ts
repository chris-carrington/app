// app/src/faq/faq.directive.ts

import { faqIndexSignal } from './faqIndex.signal'

export default function (el: HTMLElement, dirIndex: number) {
  faqIndexSignal.onChange(el, openIndex => {
    const isOpen = openIndex === dirIndex

    el.classList.toggle('faq-open', isOpen)
    el.classList.toggle('faq-closed', !isOpen)

    const answer = el.nextElementSibling

    if (answer) {
      answer.classList.toggle('faq-answer-open', isOpen)
      answer.classList.toggle('faq-answer-closed', !isOpen)
    }
  })

  el.addEventListener('click', () => {
    faqIndexSignal.set(faqIndexSignal.get === dirIndex ? -1 : dirIndex)
  })
}
