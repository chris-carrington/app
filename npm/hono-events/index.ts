// app/npm/hono-events/index.ts


/**
 * ### A type-safe event emitter
 * - Supports
 *     - `on()`: Register an event listener
 *     - `once()`: Register a one‑time event listener, automatically unsubscribes after the first emission
 *     - `emit()`: Emit an event
 *     - `unsubscribe()`: Removes every listener attached to an event OR Removes every listener for every event
 * @template T_Events - A record mapping event names to their payload types
 * @example
  ```
  const appEvents = new HonoEvents<{
    ping: undefined,
    onSignIn: { personId: number },
  }>()

  appEvents.once('ping', () => console.log('pong')) // auto unsubscribes post 1st emit
  
  const sub = appEvents.on('onSignIn', (data) => { // data is type-safe
    console.log(`Account ${data.personId} signed in`)
  })

  appEvents.emit('ping') // no passing data required
  appEvents.emit('onSignIn', { personId: 1 }) // type-safe!

  sub.unsubscribe()
  ```
 */
export class HonoEvents<T_Events extends HonoEventsRecord> {
  #listeners = new Map<keyof T_Events, Set<HonoEventsListener<any>>>()


  /**
   * Register a listener for an event
   * @param event - The event name (must be a key of T_Events)
   * @param listener - The callback that receives the payload
   * @returns A subscription object with an `unsubscribe` method
   */
  on<T_Event extends keyof T_Events>(event: T_Event, listener: HonoEventsListener<T_Events[T_Event]>): { unsubscribe: () => void } {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, new Set())
    }

    this.#listeners.get(event)!.add(listener)

    return {
      unsubscribe: () => {
        const set = this.#listeners.get(event)

        if (set) {
          set.delete(listener)

          if (set.size === 0) {
            this.#listeners.delete(event)
          }
        }
      },
    }
  }


  /**
   * Register a one‑time event listener, automatically unsubscribes after the first emission
   * @param event - The event name (must be a key of T_Events)
   * @param listener - The callback that receives the payload
   * @returns A subscription object with an `unsubscribe` method
   */
  once<T_Event extends keyof T_Events>(event: T_Event, listener: HonoEventsListener<T_Events[T_Event]>): { unsubscribe: () => void } {
    const onceWrapper: HonoEventsListener<T_Events[T_Event]> = (data) => {
      this.#off(event, onceWrapper)
      listener(data)
    }

    return this.on(event, onceWrapper)
  }


  /** Remove an event listener, `once()` helper */
  #off<K extends keyof T_Events>(event: K, listener: HonoEventsListener<T_Events[K]>): void {
    const set = this.#listeners.get(event)

    if (set) {
      set.delete(listener)
      if (set.size === 0) this.#listeners.delete(event)
    }
  }


  /**
   * Emit an event
   * @param event - The event name
   * @param data - The payload (must match T_Events[K])
   */
  emit<T_Event extends keyof T_Events>(
    event: T_Event,
    ...args: T_Events[T_Event] extends undefined ? [] : [data: T_Events[T_Event]]
  ): void {
    const data = args[0]
    const set = this.#listeners.get(event)

    if (set) {
      for (const listener of Array.from(set)) {
        listener(data as any)
      }
    }
  }

  /**
   * Removes every listener attached to an event OR Removes every listener for every event
   * @example
  ```
  const sub1 = appEvents.on('onSignIn', () => console.log('1'))
  const sub2 = appEvents.on('onSignIn', () => console.log('2'))

  sub1.unsubscribe() // Removes one listener (the sub1 listener)

  appEvents.unsubscribe('onSignIn') // Removes every listener attached to the 'onSignIn' event

  appEvents.unsubscribe() // Removes every listener for every event
  ```
   */
  unsubscribe(event?: keyof T_Events): void {
    event ? this.#listeners.delete(event) : this.#listeners.clear()
  }
}


export type HonoEventsListener<T_Event extends keyof HonoEventsRecord> = (data: T_Event) => void


export type HonoEventsRecord = Record<string, any>
