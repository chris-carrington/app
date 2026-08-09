// app/hono-toast/src/styleObjects.ts

import type { CSSProperties } from './types'


export const toastIconStyleSuccess: CSSProperties = {
  '--toast-icon-color': 'rgb(3, 84, 63)',
  '--toast-icon-border': '1px solid rgb(14, 159, 110)',
  '--toast-icon-bg': 'rgb(188, 240, 218)',
}

export const toastIconStyleInfo: CSSProperties = {
  '--toast-icon-color': 'rgb(30, 66, 159)',
  '--toast-icon-border': '1px solid rgb(63, 131, 248)',
  '--toast-icon-bg': 'rgb(195, 221, 253)',
}

export const toastIconStyleDanger: CSSProperties = {
  '--toast-icon-color': 'rgb(153, 27, 27)',
  '--toast-icon-border': '1px solid rgb(248, 113, 113)',
  '--toast-icon-bg': 'rgb(254, 202, 202)',
}

export const defaultToastStyle: CSSProperties = {
  '--popover': 'rgb(31, 41, 55)',
  '--popover-foreground': 'rgb(214, 217, 223)',
  '--shadow-subtle': '0 2px 10px rgba(0, 0, 0, 0.35), 0 1px 3px rgba(255, 255, 255, 0.05) inset',
  '--muted-foreground': 'rgb(156, 163, 175)',
}
