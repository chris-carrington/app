// app/src/nav/onHomeClick.directive.ts

export default (el: HTMLAnchorElement) => {
  el.addEventListener('click', (event: MouseEvent) => {
    if (window.location.pathname === '/') {
      event.preventDefault() // stops the browser from following the href
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })
}
