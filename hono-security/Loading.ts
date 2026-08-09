// app/hono-security/Loading.ts

export class Loading {
  #btn: HTMLButtonElement
  #ogTextContent: string | undefined

  constructor(el: HTMLFormElement) {
    const btn = el.querySelector<HTMLButtonElement>('button[type="submit"]')
    if (!btn) throw new Error('!btn')

    this.#btn = btn
    this.#ogTextContent = this.#btn?.textContent
  }

  start () {
    this.#btn.disabled = true
    this.#btn.textContent = 'Loading...'
  }

  stop() {
    this.#btn.disabled = false
    this.#btn.textContent = this.#ogTextContent ?? ''
  }
}
