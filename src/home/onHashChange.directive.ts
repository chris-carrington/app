// app/src/home/onHashChange.directive.ts

import { dom } from '@dom'


export default (el: HTMLDivElement) => {
  const defaultHashKey = 'service-request'

  const stepIds = ['service-request', 'join-leadership', 'join-newsletter', 'contact-us']

  const stepsRegex = new RegExp(`^#(${stepIds.join('|')})(?:-(scroll))?$`)

  const steps: Step[] = []

  for (const id of stepIds) {
    steps.push({
      id,
      domForm: dom<HTMLDivElement>(`#${id}`).root(el).one(),
      domAnchor: dom<HTMLAnchorElement>(`a[href="#${id}"]`).root(el).one()
    })
  }

  function onHashChange() {
    const match = window.location.hash.match(stepsRegex) // [1] = hashKey, [2] = scroll suffix

    if (match) updateDOM(match[1], match[2] === 'scroll')
    else updateDOM(defaultHashKey, false)
  }

  function updateDOM(id: string, scroll = true) {
    for (const step of steps) {
      step.domForm?.classList.toggle('hidden', id !== step.id) // set form class
      step.domAnchor?.classList.toggle('orange', id === step.id) // set orange class
      step.domAnchor?.classList.toggle('transparent', id !== step.id) // set transparent class
      if (scroll && id === step.id) step.domForm?.scrollIntoView({ behavior: 'smooth' }) // 🚨 scroll post visiblity toggle so we scroll after our requested div is visible
    }
  }

  window.addEventListener('hashchange', onHashChange)

  onHashChange()
}


type Step = {
  id: string,
  domForm: HTMLDivElement,
  domAnchor: HTMLAnchorElement
}
