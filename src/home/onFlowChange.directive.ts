// app/src/home/onFlowChange.directive.ts

import { query } from '@hono-dom'
import { flowSteps } from './flowSteps'
import { datasetFlowStepButton, datasetFlowStepContainer } from '@src/lib/dom'


export default (el: HTMLDivElement) => {
  const datasetButton = datasetFlowStepButton()
  const datasetContainer = datasetFlowStepContainer()

  for (const step of flowSteps) {
    step.domSteps = query<HTMLDivElement>(datasetContainer.query(step.id)).root(el).one()
    step.domButton = query<HTMLButtonElement>(datasetButton.query(step.id)).root(el).one()
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
