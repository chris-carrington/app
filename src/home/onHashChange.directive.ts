// app/src/home/onHashChange.directive.ts

export default (el: HTMLDivElement) => {
  const defaultHashKey = 'service-request'

  const steps: Step[] = [
    { id: 'service-request', domForm: null, domAnchor: null },
    { id: 'join-leadership', domForm: null, domAnchor: null },
    { id: 'join-newsletter', domForm: null, domAnchor: null },
    { id: 'contact-us', domForm: null, domAnchor: null },
  ]

  const stepsRegex = new RegExp(`^#(${steps.map(s => s.id).join('|')})(?:-(scroll))?$`)

  for (const step of steps) {
    step.domForm = el.querySelector<HTMLDivElement>(`#${step.id}`)
    step.domAnchor = el.querySelector<HTMLAnchorElement>(`a[href="#${step.id}"]`)
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
  domForm: null | HTMLDivElement,
  domAnchor: null | HTMLAnchorElement
}
