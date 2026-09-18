// app/npm/hono-modal/toggleModalDom.ts

export function toggleModalDom(modal: HTMLElement, show?: boolean) {
  const force = typeof show === 'boolean' ? !show : undefined 
  modal.classList.toggle('modal-hidden', force)
}
