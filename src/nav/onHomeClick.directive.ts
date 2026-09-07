// app/src/nav/onHomeClick.directive.ts

export default (el: HTMLAnchorElement) => {
  el.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (window.location.hash) history.replaceState(null, '', '/') // IF there is a hash set THEN unset it
  })
}
