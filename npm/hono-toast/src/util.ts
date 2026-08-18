// app/npm/hono-toast/src/util.ts

import { vars } from './vars'
import svgInfo from './info.svg?raw'
import svgClose from './close.svg?raw'
import svgDanger from './danger.svg?raw'
import svgSuccess from './success.svg?raw'
import type { CSSProperties, ShowToastProps, ToastVariant } from './types'
import { defaultToastStyle, toastIconStyleDanger, toastIconStyleInfo, toastIconStyleSuccess } from './styleObjects'


export function smoothHide(el: HTMLElement): void {
  el.style.maxHeight = `${el.scrollHeight}px`

  requestAnimationFrame(() => {
    el.style.margin = '0'
    el.style.opacity = '0'
    el.style.padding = '0'
    el.style.maxHeight = '0'
    el.style.borderWidth = '0'
  })
}


export function removeToastElement(id: string): void {
  const record = vars.toastMap.get(id)
  if (!record) return

  if (record.timeoutId) {
    clearTimeout(record.timeoutId)
    record.timeoutId = undefined
  }

  if (record.element.parentNode) {
    record.element.parentNode.removeChild(record.element)
  }

  vars.toastMap.delete(id)
}


export function createToastElement(props: ShowToastProps): { element: HTMLDivElement, id: string } {
  const {
    value,
    variant,
    $div = {},
    icon: customIcon,
    position = vars.defaultPosition,
  } = props

  const id = $div.id ?? 'toast-' + crypto.randomUUID()

  // Determine icon (null means no icon)
  let iconHtml: string | null = null

  if (customIcon !== undefined) {
    iconHtml = customIcon // could be null or string
  } else {
    iconHtml = defaultIconForVariant(variant)
  }

  // Build the toast div
  const toastDiv = document.createElement('div')
  toastDiv.id = id
  toastDiv.setAttribute('role', 'alert')
  toastDiv.setAttribute('tabindex', '0')

  // Compute classes
  const baseClass = 'toast'
  const variantClass = variant ? `toast--${variant}` : ''
  const positionClass = position.startsWith('top') ? 'toast--top' : 'toast--bottom'
  const extraClass = $div.class || ''
  toastDiv.className = mergeStrings(baseClass, variantClass, positionClass, extraClass)

  // Apply styles (merged)
  const style = buildToastStyle(props)
  applyStyles(toastDiv, style)

  // Additional attributes from $div (except id, class, style)
  for (const [key, val] of Object.entries($div)) {
    if (key === 'id' || key === 'class' || key === 'style') continue
    if (val !== undefined && val !== null) {
      toastDiv.setAttribute(key, String(val))
    }
  }

  // Icon (if present)
  if (iconHtml !== null) {
    const iconWrapper = document.createElement('div')
    iconWrapper.className = 'toast__icon-wrapper'
    const iconDiv = document.createElement('div')
    iconDiv.className = 'toast__icon'
    iconDiv.innerHTML = iconHtml
    iconWrapper.appendChild(iconDiv)
    toastDiv.appendChild(iconWrapper)
  }

  // Content
  const contentDiv = document.createElement('div')
  contentDiv.className = 'toast__content'

  // If value is a function, call it otherwise use as string
  const contentHtml = typeof value === 'function' ? value() : value
  contentDiv.innerHTML = contentHtml
  toastDiv.appendChild(contentDiv)

  // Close button
  const closeBtn = document.createElement('button')
  closeBtn.className = 'toast__close'
  closeBtn.setAttribute('aria-label', 'Dismiss toast notification')
  closeBtn.innerHTML = svgClose

  closeBtn.addEventListener('click', () => {
    const record = vars.toastMap.get(id)

    if (record) {
      if (record.timeoutId) {
        clearTimeout(record.timeoutId)
        record.timeoutId = undefined
      }

      smoothHide(record.element)
      setTimeout(() => removeToastElement(id), 630)
    }
  })

  toastDiv.appendChild(closeBtn)

  return { element: toastDiv, id }
}


function applyStyles(element: HTMLElement, styles: CSSProperties): void {
  for (const [key, value] of Object.entries(styles)) {
    if (value !== undefined && value !== null) {
      element.style.setProperty(key, String(value))
    }
  }
}


function mergeStrings(baseStr: string, ...reqStrs: (string | undefined)[]): string {
  let result = baseStr

  for (const reqStr of reqStrs) { // loop through all request strings
    if (reqStr) { // check for truthiness (non-null, non-undefined, non-empty string)
      result += ' ' + reqStr // concatenate with a leading space
    }
  }

  return result
}


function defaultIconForVariant(variant?: ToastVariant): string | null {
  switch (variant) {
    case 'success': return svgSuccess
    case 'danger': return svgDanger
    default: return svgInfo
  }
}


function defaultStyleForVariant(variant?: ToastVariant): CSSProperties {
  switch (variant) {
    case 'success': return toastIconStyleSuccess
    case 'danger': return toastIconStyleDanger
    case 'info': return toastIconStyleInfo
    default: return {}
  }
}


function buildToastStyle(props: ShowToastProps): CSSProperties {
  const base = defaultToastStyle
  const propsStyle: CSSProperties = {}
  const propsDivStyle = props.$div?.style || {}
  const variantStyle = defaultStyleForVariant(props.variant)

  if (props.width) propsStyle['--toast-max-width'] = props.width
  if (props.foreground) propsStyle['--popover-foreground'] = props.foreground
  if (props.background) propsStyle['--popover'] = props.background
  if (props.boxShadow) propsStyle['--shadow-subtle'] = props.boxShadow
  if (props.iconColor) propsStyle['--toast-icon-color'] = props.iconColor
  if (props.iconBackground) propsStyle['--toast-icon-bg'] = props.iconBackground
  if (props.closeForeground) propsStyle['--muted-foreground'] = props.closeForeground

  return { ...base, ...variantStyle, ...propsStyle, ...propsDivStyle }
}
