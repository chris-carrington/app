// app/src/counter/counterVanilla.directive.ts

import { counterSignal } from './counter.signal'


export default (el: HTMLButtonElement) => { // directive
  counterSignal.onChange(el, (val) => {
    el.textContent = `Vanilla Count: ${val}`
  })

  el.addEventListener('click', () => {
    counterSignal.set(val => ++val)
  })
}
