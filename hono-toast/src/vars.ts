// app/hono-toast/src/vars.ts

import type { ToastRecord, ToastPosition } from './types'


export class Vars {
  defaultMs = 9000
  wrapper: null | HTMLDivElement // null on BE
  defaultPosition: ToastPosition = 'topCenter'
  toastMap = new Map<string, ToastRecord>()
  containers = new Map<ToastPosition, HTMLDivElement>()
  POSITIONS = [
    'topCenter',
    'topLeft',
    'topRight',
    'bottomCenter',
    'bottomLeft',
    'bottomRight',
  ] as const

  constructor() {
    this.wrapper = typeof window !== 'undefined'
      ? (document.querySelector<HTMLDivElement>('#hono-toast-wrapper') ?? this.#createWrapper())
      : null

    if (this.wrapper && this.containers.size === 0) {
      for (const position of this.POSITIONS) {
        const container = this.wrapper.querySelector<HTMLDivElement>(`.hono-toast-container--${position}`)
        if (!container) throw new Error('!container')
        this.containers.set(position, container)
      }
    }
  }

  #createWrapper() {
    const wrapper = document.createElement('div')
    wrapper.id = 'hono-toast-wrapper'
    wrapper.setAttribute('aria-live', 'polite')
    wrapper.setAttribute('aria-atomic', 'false')
    document.body.appendChild(wrapper)

    // Create one container per position
    for (const pos of this.POSITIONS) {
      const container = document.createElement('div')
      container.className = `hono-toast-container hono-toast-container--${pos}`
      container.setAttribute('aria-live', 'polite')
      wrapper.appendChild(container)
      this.containers.set(pos, container)
    }

    return wrapper
  }
}


export const vars = new Vars()
