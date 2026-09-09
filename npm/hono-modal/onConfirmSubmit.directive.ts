import { onConfirmEvents } from './onConfirmEvents'


export default (el: HTMLFormElement) => {
  el.addEventListener('submit', (e) => {
    e.preventDefault()
    onConfirmEvents.emit('confirmButtonClicked')
  })
}
