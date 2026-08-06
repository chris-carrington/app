// app/src/home/onHashChange.directive.ts

export default (el: HTMLDivElement) => {
  const steps: Step[] = [
    { id: 'service-request', domForm: null, domAnchor: null },
    { id: 'join-leadership', domForm: null, domAnchor: null },
    { id: 'join-newsletter', domForm: null, domAnchor: null },
    { id: 'contact-us', domForm: null, domAnchor: null },
  ]

  for (const step of steps) {
    step.domForm = el.querySelector<HTMLDivElement>(`#${step.id}`)
    step.domAnchor = el.querySelector<HTMLAnchorElement>(`a[href="#${step.id}"]`)
  }

  function onHashChange() {
    switch (window.location.hash) {
      case '#service-request':
        updateDOM('service-request')
        break
      case '#join-leadership':
        updateDOM('join-leadership')
        break
      case '#join-newsletter':
        updateDOM('join-newsletter')
        break
      case '#contact-us':
        updateDOM('contact-us')
        break
      default:
        updateDOM('service-request', false)
        break
    }
  }

  function updateDOM(id: string, scroll = true) {
    for (const step of steps) {
      if (scroll) steps[0].domForm?.scrollIntoView({ behavior: 'smooth' }) // scroll
      step.domForm?.classList.toggle('hidden', id !== step.id) // set form class
      step.domAnchor?.classList.toggle('active', id === step.id) // set button class
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
