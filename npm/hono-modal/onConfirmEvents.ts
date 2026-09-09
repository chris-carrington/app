import { HonoEvents } from '@hono-events'


export const onConfirmEvents = new HonoEvents<{
  hideModal: undefined,
  confirmButtonClicked: undefined,
  isConfirmActionLoading: boolean,
}>()


onConfirmEvents.on('isConfirmActionLoading', (isLoading) => {
  const btn = document.querySelector<HTMLButtonElement>('#modal-confirm button[type="submit"]')
  if (!btn) throw new Error('!btn')

  if (isLoading) {
    btn.disabled = true
    btn.textContent = 'Loading...'
  } else {
    btn.disabled = false
    btn.textContent = 'OK'
  }
})


onConfirmEvents.on('hideModal', () => {
  const modal = document.getElementById('modal-confirm')
  if (!modal) throw new Error('!modal')

  modal.classList.add('hidden')
})
