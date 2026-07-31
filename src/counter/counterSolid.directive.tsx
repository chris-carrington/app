/** @jsxImportSource solid-js */ // app/src/counter/counterSolid.directive.tsx

import { render } from 'solid-js/web'
import { counterSignal } from './counter.signal'


export default (el: HTMLElement) => { // directive
  render(() => <Counter />, el)  
}

function Counter() { // component
  return <>
    <button onClick={() => counterSignal.set(val => ++val)}>
      Solid Count: {counterSignal.get}
    </button>
  </>
}
