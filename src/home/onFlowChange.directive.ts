// app/src/home/onFlowChange.directive.ts

import { query } from '@hono-dom'
import { safeArrayAccess } from '@safely-access'
import { dsFlowSteps } from '@src/dataStructures/flowSteps.ds'
import { datasetFlowStepButton, datasetFlowStepContainer } from '@src/lib/dom'


export default (el: HTMLDivElement) => {
  const datasetButton = datasetFlowStepButton()
  const datasetContainer = datasetFlowStepContainer()

  for (const step of dsFlowSteps) {
    step.domSteps = query<HTMLDivElement>(datasetContainer.query(step.id)).root(el).one()
    step.domButton = query<HTMLButtonElement>(datasetButton.query(step.id)).root(el).one()
  }

  for (const step of dsFlowSteps) {
    step.domButton?.addEventListener('click', () => {
      onFlowChange(step.id)
    })
  }

  function onFlowChange(id: string) {
    for (const s of dsFlowSteps) {
      s.domSteps?.style.setProperty('--steps', String(s.steps.length)) // set steps count
      s.domSteps?.classList.toggle('hidden', s.id !== id) // set steps hidden class
      s.domButton?.classList.toggle('orange', s.id === id) // set button active class
      s.domButton?.classList.toggle('transparent', s.id !== id) // set button transparent class
    }
  }

  onFlowChange(safeArrayAccess(dsFlowSteps, 0).id)
}
