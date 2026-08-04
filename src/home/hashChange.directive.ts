// app/src/home/hashChange.directive.ts

export default (el: HTMLDivElement) => { // directive
  const ids = [
    'service-request',
    'join-leadership',
  ]

  const forms = [
    el.querySelector(`#${ids[0]}`),
    el.querySelector(`#${ids[1]}`),
  ]

  const buttons = [
    el.querySelector(`a[href="#${ids[0]}"]`),
    el.querySelector(`a[href="#${ids[1]}"]`),
  ]

  function onHashChange() {
    switch (window.location.hash) {
      case '#service-request':
        updateDOM(0)
        break
      case '#join-leadership':
        updateDOM(1)
        break
      default:
        updateDOM(0, false)
        break
    }
  }

  function updateDOM(iMatch: number, scroll = true) {
    for (let iCurrent = 0; iCurrent < forms.length; iCurrent++) {
      if (scroll) forms[0]?.scrollIntoView({ behavior: 'smooth' }) // scroll
      forms[iCurrent]?.classList[iCurrent === iMatch ? 'remove' : 'add']('hidden') // set forms class
      buttons[iCurrent]?.classList[iCurrent === iMatch ? 'add' : 'remove']('active') // set button class
    }
  }

  window.addEventListener('hashchange', onHashChange)

  onHashChange()
}
