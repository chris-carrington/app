// app/src/faq/faqIndex.signal.ts

import { Signal } from '@hono-signals'

export const faqIndexSignal = new Signal({
  initial: -1,
  persist: 'localStorage',
  key: 'faqIndex',
})
