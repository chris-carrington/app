export default (el: HTMLFormElement) => {
  el.querySelector<HTMLInputElement>('#text--sign-up--firstName')?.focus()
}
