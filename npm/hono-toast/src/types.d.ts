// app/npm/hono-toast/src/types.d.ts

import { Vars } from './vars'


export type ToastVariant = 'info' | 'success' | 'danger'


export type ToastPosition = Vars['POSITIONS'][number]


export type CSSProperties = Record<string, string>


export type ShowToast = (props: ShowToastProps) => {
  id: string,
  remove: () => void,
}


export type ToastRecord = {
  id: string,
  element: HTMLDivElement,
  position: ToastPosition,
  timeoutId?: ReturnType<typeof setTimeout>,
}


/** The `props` that are provided to `showToast()` */
export type ShowToastProps = {
  /** Toast content: string, or a function returning HTML string */
  value: string | (() => string),
  /** Visual variant (sets default icon & styles) */
  variant?: ToastVariant,
  /** Where to place the toast (default: 'topCenter') */
  position?: ToastPosition,
  /** Auto‑dismiss timeout (ms), Infinity = never */
  ms?: number,
  /** Custom icon (HTML string), set to null to hide icon */
  icon?: string | null,
  /** Additional attributes for the toast `<div>` (id, class, style, etc.) */
  $div?: {
    id?: string,
    class?: string,
    style?: CSSProperties,
    [key: string]: unknown,
  },
  /** Optional style overrides (shorthands for CSS custom properties) */
  width?: string,
  foreground?: string,
  background?: string,
  boxShadow?: string,
  iconColor?: string,
  iconBackground?: string,
  closeForeground?: string,
}
