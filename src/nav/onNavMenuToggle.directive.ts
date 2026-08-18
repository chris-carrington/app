// app/src/nav/onNavMenuToggle.directive.ts

export default (el: HTMLButtonElement, id: string) => {
  const menu = document.getElementById(id)

  el.addEventListener('click', async () => {
    if (!menu) throw new Error('!menu')

    menu.classList.toggle('hidden')

    if (menu.classList.contains('hidden')) setTimeout(() => menu.dataset.auth = 'undefined', 600)
    else {
      const res = await fetch('/api/session')
      const json = await res.json() as { authenticated: boolean }

      menu.dataset.auth = String(json.authenticated)
    }
  })
}
