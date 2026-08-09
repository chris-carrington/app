// app/hono-toast/toast.ts
import svgInfo from './info.svg?raw'
import svgClose from './close.svg?raw'
import svgDanger from './danger.svg?raw'
import svgSuccess from './success.svg?raw'
import type { CSSProperties, ShowToast, ShowToastProps, ToastPosition, ToastRecord, ToastVariant } from './types'
import { defaultToastStyle, toastIconStyleDanger, toastIconStyleInfo, toastIconStyleSuccess } from './styleObjects'


export function showToast(props: ShowToastProps): ReturnType<ShowToast> {
  if (typeof window === 'undefined') {
    // Server-side dummy
    return {
      id: 'server',
      remove: () => { },
    }
  }

  // Ensure wrapper and containers exist
  getWrapper()

  const position = props.position || 'topCenter'
  const container = containers.get(position)

  if (!container) {
    throw new Error(`Invalid position: ${position}`)
  }

  const { element, id } = createToastElement(props)
  container.appendChild(element)

  // Focus for accessibility
  element.focus()

  const record: ToastRecord = { id, element, position }
  toastMap.set(id, record)

  // Auto‑dismiss
  if (props.ms !== Infinity) {
    const timeoutId = setTimeout(() => {
      const rec = toastMap.get(id)
      if (rec) {
        smoothHide(rec.element)
        setTimeout(() => removeToastElement(id), 630)
      }
    }, props.ms ?? 9000)
    record.timeoutId = timeoutId
  }

  return {
    id,
    remove: () => {
      const rec = toastMap.get(id)
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


// ------------------------------
// Helpers
// ------------------------------

function applyStyles(element: HTMLElement, styles: CSSProperties): void {
  for (const [key, value] of Object.entries(styles)) {
    if (value !== undefined && value !== null) {
      element.style.setProperty(key, String(value))
    }
  }
}

function mergeStrings(...parts: (string | undefined | null)[]): string {
  return parts.filter(Boolean).join(' ')
}

function smoothHide(el: HTMLElement): void {
  el.style.maxHeight = `${el.scrollHeight}px`
  requestAnimationFrame(() => {
    el.style.margin = '0'
    el.style.opacity = '0'
    el.style.padding = '0'
    el.style.maxHeight = '0'
    el.style.borderWidth = '0'
  })
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

// Build the final style object from props
function buildToastStyle(props: ShowToastProps): CSSProperties {
  const base = defaultToastStyle
  const variantStyle = defaultStyleForVariant(props.variant)
  const custom = props.$div?.style || {}

  // Merge in custom shorthands (they override)
  const shorthands: CSSProperties = {}
  if (props.width) shorthands['--toast-width'] = props.width
  if (props.foreground) shorthands['--popover-foreground'] = props.foreground
  if (props.background) shorthands['--popover'] = props.background
  if (props.boxShadow) shorthands['--shadow-subtle'] = props.boxShadow
  if (props.iconColor) shorthands['--toast-icon-color'] = props.iconColor
  if (props.iconBackground) shorthands['--toast-icon-bg'] = props.iconBackground
  if (props.closeForeground) shorthands['--muted-foreground'] = props.closeForeground

  return { ...base, ...variantStyle, ...shorthands, ...custom }
}

// ------------------------------
// Toast Manager
// ------------------------------

// All possible positions
const POSITIONS: ToastPosition[] = [
  'topCenter',
  'topLeft',
  'topRight',
  'bottomCenter',
  'bottomLeft',
  'bottomRight',
]

let wrapper: HTMLDivElement | null = null
const containers = new Map<ToastPosition, HTMLDivElement>()
const toastMap = new Map<string, ToastRecord>()

function getWrapper(): HTMLDivElement {
  if (!wrapper) {
    wrapper = document.createElement('div')
    wrapper.id = 'hono-toast-wrapper'
    wrapper.setAttribute('aria-live', 'polite')
    wrapper.setAttribute('aria-atomic', 'false')
    document.body.appendChild(wrapper)

    // Create one container per position
    for (const pos of POSITIONS) {
      const container = document.createElement('div')
      container.className = `hono-toast-container hono-toast-container--${pos}`
      container.setAttribute('aria-live', 'polite')
      wrapper.appendChild(container)
      containers.set(pos, container)
    }
  }
  return wrapper
}

function removeToastElement(id: string): void {
  const record = toastMap.get(id)
  if (!record) return

  if (record.timeoutId) {
    clearTimeout(record.timeoutId)
    record.timeoutId = undefined
  }

  if (record.element.parentNode) {
    record.element.parentNode.removeChild(record.element)
  }

  toastMap.delete(id)
}

function createToastElement(props: ShowToastProps): {
  element: HTMLDivElement
  id: string
} {
  const {
    value,
    variant,
    position = 'topCenter',
    ms = 9000,
    icon: customIcon,
    $div = {},
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

  // --- Build inner HTML ---

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
  // If the content is a string, set innerHTML if it's already an element, we could append, but we keep it simple.
  // We'll treat it as HTML string.
  contentDiv.innerHTML = contentHtml
  toastDiv.appendChild(contentDiv)

  // Close button
  const closeBtn = document.createElement('button')
  closeBtn.className = 'toast__close'
  closeBtn.setAttribute('aria-label', 'Dismiss toast notification')
  closeBtn.innerHTML = svgClose
  closeBtn.addEventListener('click', () => {
    const record = toastMap.get(id)
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
