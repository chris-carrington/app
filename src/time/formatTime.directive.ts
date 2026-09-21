// app/src/time/formatTime.directive.ts

import { formatTime } from '@src/time/formatTime'

export default (el: HTMLElement, epoch: number) => {
  el.textContent = formatTime(epoch)
}
