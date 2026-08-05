// app/src/home/onFlowChange.directive.ts

import { flowSteps } from './flowSteps'

export default (el: HTMLDivElement) => {
  for (const step of flowSteps) {
    step.domSteps = el.querySelector<HTMLDivElement>(`.steps[data-step="${step.id}"]`)
    step.domButton = el.querySelector<HTMLButtonElement>(`.buttons [data-step="${step.id}"]`)
  }

  for (const step of flowSteps) {
    step.domButton?.addEventListener('click', () => {
      onFlowChange(step.id)
    })
  }

  function onFlowChange(id: string) {
    for (const s of flowSteps) {
      s.domSteps?.style.setProperty('--steps', String(s.steps.length)) // set steps count
      s.domSteps?.classList[s.id === id ? 'remove' : 'add']('hidden') // set steps hidden class
      s.domButton?.classList[s.id === id ? 'add' : 'remove']('active') // set button active class
    }
  }

  onFlowChange(flowSteps[0].id)
}
