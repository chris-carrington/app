// app/src/lib/onMenuToggle.ts

export default (el: HTMLButtonElement) => {
  const menu = document.querySelector('.menu')
  el.addEventListener('click', () => menu?.classList.toggle('hidden'))
}
