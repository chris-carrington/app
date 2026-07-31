// src/signal/Persist.ts

export class Persist {
  static set(key: string, value: any, storage: 'sessionStorage' | 'localStorage'): void {
    try {
      const serialized = JSON.stringify(value)
      const target = storage === 'sessionStorage' ? sessionStorage : localStorage
      target.setItem(key, serialized)
    } catch (e) {
      console.warn(`Failed to persist "${key}" to ${storage}:`, e)
    }
  }

  static get<T>(key: string, storage: 'sessionStorage' | 'localStorage'): T | undefined {
    try {
      const target = storage === 'sessionStorage' ? sessionStorage : localStorage
      const raw = target.getItem(key)
      if (raw === null) return undefined
      return JSON.parse(raw) as T
    } catch (e) {
      console.warn(`Failed to read "${key}" from ${storage}:`, e)
      return undefined
    }
  }

  static remove(key: string, storage: 'sessionStorage' | 'localStorage'): void {
    try {
      const target = storage === 'sessionStorage' ? sessionStorage : localStorage
      target.removeItem(key)
    } catch (e) {
      console.warn(`Failed to remove "${key}" from ${storage}:`, e)
    }
  }
}
