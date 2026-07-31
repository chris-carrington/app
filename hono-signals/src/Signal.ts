import { Persist } from './Persist'
import { createStore, type SetStoreFunction } from 'solid-js/store'
import { createRoot, createEffect, getOwner, onCleanup } from 'solid-js'

type SignalOptions<T> =
  | { initial?: T; persist?: 'memory'; key?: never }
  | { initial?: T; persist: 'sessionStorage' | 'localStorage'; key: string }

export class Signal<T> {
  #store: { value: T }
  #dispose: (() => void) | null = null
  #listeners: Set<(val: T) => void> = new Set()
  #observers: Map<Element, { observer: MutationObserver; unsubscribe: () => void }> = new Map()

  setStore: SetStoreFunction<{ value: T }>

  constructor(options: SignalOptions<T> = {}) {
    const { initial, persist = 'memory', key } = options

    let startValue: T = initial as T
    if (persist !== 'memory' && key) {
      const stored = Persist.get<T>(key, persist)
      if (stored !== undefined) {
        startValue = stored
      }
    }

    const [store, setStore] = createStore({ value: startValue })
    this.#store = store
    this.setStore = setStore

    createRoot(() => {
      createEffect(() => {
        const current = store.value
        if (persist !== 'memory' && key) {
          if (current === undefined) {
            Persist.remove(key, persist)
          } else {
            Persist.set(key, current, persist)
          }
        }
        this.#listeners.forEach(fn => fn(current))
      })
    })

    this.set = this.set.bind(this)
    this.onChange = this.onChange.bind(this)
    this.dispose = this.dispose.bind(this)
  }

  /**
   * Get the current value (unwrapped).
   */
  get get(): T {
    return this.#store.value
  }

  /**
   * Set the value (direct or updater).
   */
  set(value: T | ((prev: T) => T)): void {
    if (typeof value === 'function') {
      const updater = value as (prev: T) => T
      const prev = this.#store.value
      this.setStore('value', updater(prev))
    } else {
      this.setStore('value', value)
    }
  }

  /**
   * Bind the signal to a DOM element.
   * Calls the callback with the current value and on every change.
   * Automatically cleans up when the element is removed.
   */
  onChange(element: Element, callback: (val: T) => void): () => void {
    // Initial call
    callback(this.get)

    // Add listener
    this.#listeners.add(callback)

    const unsubscribe = () => {
      this.#listeners.delete(callback)
    }

    // Auto‑cleanup if inside a Solid owner
    const owner = getOwner()
    if (owner) {
      onCleanup(unsubscribe)
    }

    // Cleanup on DOM removal
    const observer = new MutationObserver(() => {
      if (!document.contains(element)) {
        unsubscribe()
        observer.disconnect()
        this.#observers.delete(element)
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
    this.#observers.set(element, { observer, unsubscribe })

    // Return combined dispose
    return () => {
      unsubscribe()
      observer.disconnect()
      this.#observers.delete(element)
    }
  }

  /**
   * Clean up all observers and listeners.
   */
  dispose(): void {
    for (const { observer } of this.#observers.values()) {
      observer.disconnect()
    }
    this.#observers.clear()

    if (this.#dispose) {
      this.#dispose()
      this.#dispose = null
      this.#listeners.clear()
    }
  }
}
