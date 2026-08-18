// app/src/nav/onMenuToggle.directive.ts

export default (el: HTMLButtonElement, querySelector: string) => {
  const menu = document.querySelector(querySelector)
  el.addEventListener('click', () => menu?.classList.toggle('hidden'))
}
