// app/src/nav/onMenuToggle.directive.ts

export default (el: HTMLButtonElement) => {
  const menu = document.querySelector('.menu')
  el.addEventListener('click', () => menu?.classList.toggle('hidden'))
}
