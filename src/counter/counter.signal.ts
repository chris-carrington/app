// app/src/counter/counter.signal.ts

import { Signal } from '@hono-signals'

export const counterSignal = new Signal({
  initial: 0,
  persist: 'localStorage',
  key: 'counter',
})
