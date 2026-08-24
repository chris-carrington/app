// app/src/home/onFlowChange.directive.ts

import { dom } from '@dom'
import { flowSteps } from './flowSteps'

export default (el: HTMLDivElement) => {
  for (const step of flowSteps) {
    step.domSteps = dom<HTMLDivElement>(`.steps[data-step="${step.id}"]`).root(el).one()
    step.domButton = dom<HTMLButtonElement>(`.buttons [data-step="${step.id}"]`).root(el).one()
  }

  for (const step of flowSteps) {
    step.domButton?.addEventListener('click', () => {
      onFlowChange(step.id)
    })
  }

  function onFlowChange(id: string) {
    for (const s of flowSteps) {
      s.domSteps?.style.setProperty('--steps', String(s.steps.length)) // set steps count
      s.domSteps?.classList.toggle('hidden', s.id !== id) // set steps hidden class
      s.domButton?.classList.toggle('orange', s.id === id) // set button active class
      s.domButton?.classList.toggle('transparent', s.id !== id) // set button transparent class
    }
  }

  onFlowChange(flowSteps[0].id)
}
