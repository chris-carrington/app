// app/hono-toast/src/toast.ts

import { vars } from './vars'
import type { ShowToast, ShowToastProps, ToastRecord } from './types'
import { createToastElement, removeToastElement, smoothHide } from './util'


export function showToast(props: ShowToastProps): ReturnType<ShowToast> {
  if (typeof window === 'undefined') throw new Error('Please do not call on server side')

  const position = props.position || vars.defaultPosition
  const container = vars.containers.get(position)

  if (!container) throw new Error(`Invalid position: ${position}`)

  const { element, id } = createToastElement(props)
  container.appendChild(element)

  element.focus() // focus for accessibility

  const record: ToastRecord = { id, element, position }
  vars.toastMap.set(id, record)

  if (props.ms !== Infinity) { // auto‑dismiss
    const timeoutId = setTimeout(() => {
      const rec = vars.toastMap.get(id)

      if (rec) {
        smoothHide(rec.element)
        setTimeout(() => removeToastElement(id), 630)
      }
    }, props.ms ?? vars.defaultMs)

    record.timeoutId = timeoutId
  }

  return {
    id,
    remove: () => {
      const rec = vars.toastMap.get(id)

      if (rec) {
        if (rec.timeoutId) {
          clearTimeout(rec.timeoutId)
          rec.timeoutId = undefined
        }

        smoothHide(rec.element)
        setTimeout(() => removeToastElement(id), 630)
      }
    },
  }
}


export function showErrorToast(value: string): ReturnType<ShowToast> {
  return showToast({ variant: 'danger', value, ms: Infinity })
}
