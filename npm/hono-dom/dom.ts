// app/npm/hono-dom/dom.ts

import { query } from './query'
import type { IdReturn } from './id'
import type { FieldReturn } from './field'
import type { DatasetReturn } from './dataset'
import { safeArrayAccess } from '@safely-access'
import type { ClassNameReturn } from './className'



export function dom<T_First extends HTMLElement = HTMLDivElement>( // Overload: variant = 'one'
  variant: 'one',
  source: DomSource,
  templateFirstChildClass?: ElementClass<T_First>
): DomBuilder<'one', T_First>



export function dom<T_First extends HTMLElement = HTMLElement>( // Overload: variant = 'all'
  variant: 'all',
  source: DomSource
): DomBuilder<'all', T_First>



/**
 * Edit DOM element(s)
 * @example
  ```
  // Mark every rendered comment as read
  dom('all', classNameComment())
    .onSource(el => el.classList.add('read'))
    .run()

  // Clone a template and place it into the DOM
  dom('one', idCommentTemplate(), HTMLDivElement)
    .on(classNameValue(), el => el.textContent = comment)
    .on(classNameName(), el => el.textContent = `${firstName} ${lastName}`)
    .clone('append', this.divComments) // 'append' | 'prepend' | 'before' | 'after'
    .run()
  ```
 * @param variant Would we love to get edit one parent element OR all elements that match a selector
 * @param source As a string we'll pass it to querySelector all, also supports the return value from `@hono-dom's` `id()`, `dataset()`, `field()` and `className()`
 * @param templateFirstChildClass The element's w/in a `<template />` cannot be queried via `querySelectorAll()`, define this to let us know that we are altering an element w/in `<template />` to let us know what html element it is (e.g., `HTMLDivElement`)
 */
export function dom(
  variant: DomVariant,
  source: DomSource,
  templateFirstChildClass?: ElementClass<any>
): any {
  return new DomBuilder(variant, source, templateFirstChildClass)
}



export class DomBuilder<T_DomVariant extends DomVariant = 'one', T_First extends HTMLElement = HTMLElement> {
  readonly #variant: T_DomVariant
  readonly #source: DomSource
  readonly #templateClass?: ElementClass<T_First>
  readonly #ops: Op[] = []
  #sourceOp?: Mutate<T_First>
  #clone?: { position: DomPosition; parent: HTMLElement }
  #resolved?: T_First | T_First[]

  constructor(variant: T_DomVariant, source: DomSource, templateClass?: ElementClass<T_First>) {
    if (variant === 'all' && templateClass) {
      throw new Error("❌ templateFirstChildClass is only supported with variant 'one'")
    }

    this.#variant = variant
    this.#source = source
    this.#templateClass = templateClass
  }

  onSource(mutate: Mutate<T_First>): this {
    this.#sourceOp = mutate
    return this
  }

  on<T extends HTMLElement = HTMLElement>(selector: DomSource, mutate: Mutate<T>): this {
    this.#ops.push({ selector: toQuery(selector), all: false, mutate: mutate as Mutate<HTMLElement> })
    return this
  }

  onAll<T extends HTMLElement = HTMLElement>(selector: DomSource, mutate: Mutate<T>): this {
    this.#ops.push({ selector: toQuery(selector), all: true, mutate: mutate as Mutate<HTMLElement> })
    return this
  }

  clone(position: DomPosition, parent: HTMLElement): this {
    this.#clone = { position, parent }
    return this
  }

  run(): T_DomVariant extends 'one' ? T_First : T_First[] {
    const resolved = this.#resolve()

    const originals: T_First[] = this.#variant === 'one'
      ? [resolved as T_First]
      : (resolved as T_First[])

    const results: T_First[] = new Array(originals.length)
    const ops = this.#ops

    for (let i = 0, n = originals.length; i < n; i++) {
      const original = safeArrayAccess(originals, i)

      // Template mode always clones (never mutate template content).
      // Direct mode clones only when `.clone()` was called; otherwise edits in place.
      const target = (this.#clone || this.#templateClass)
        ? (original.cloneNode(true) as T_First)
        : original

      this.#sourceOp?.(target)

      // Every op is scoped to `target`, never `document` — O(target-subtree), not O(D).
      for (let j = 0, len = ops.length; j < len; j++) {
        const op = safeArrayAccess(ops, j)

        if (op.all) {
          const list = target.querySelectorAll<HTMLElement>(op.selector)
          if (!list.length) throw new Error(`❌ Not found: ${op.selector}`)
          for (let k = 0, kLen = list.length; k < kLen; k++) op.mutate(safeArrayAccess(list, k))
        } else {
          const el = target.querySelector<HTMLElement>(op.selector)
          if (!el) throw new Error(`❌ Not found: ${op.selector}`)
          op.mutate(el)
        }
      }

      // Single DOM insertion — one layout + one paint. Using primitives
      // (appendChild / insertBefore) sidesteps Cloudflare Workers' Element
      // augmentation, which narrows append/prepend/before/after to
      // string | ReadableStream | Response.
      if (this.#clone) {
        const { position, parent } = this.#clone

        switch (position) {
          case 'append': parent.appendChild(target); break
          case 'prepend': parent.insertBefore(target, parent.firstChild); break
          case 'before': parent.parentNode?.insertBefore(target, parent); break
          case 'after': parent.parentNode?.insertBefore(target, parent.nextSibling); break
        }
      }

      results[i] = target
    }

    return (this.#variant === 'one' ? results[0] : results) as T_DomVariant extends 'one' ? T_First : T_First[]
  }

  #resolve(): T_First | T_First[] {
    if (this.#resolved) return this.#resolved

    if (this.#variant === 'one') {
      if (this.#source instanceof HTMLElement) {
        return (this.#resolved = this.#source as T_First)
      }

      const q = toQuery(this.#source)

      if (this.#templateClass) {
        const tpl = query<HTMLTemplateElement>(q).one()
        const first = tpl.content.firstElementChild

        if (!(first instanceof this.#templateClass)) {
          throw new Error(`❌ Expected ${this.#templateClass.name} as first child of template ${q}`)
        }

        return (this.#resolved = first as T_First)
      }

      return (this.#resolved = query<T_First>(q).one())
    }

    // variant === 'all'
    const list: T_First[] = this.#source instanceof HTMLElement
      ? [this.#source as T_First]
      : Array.from(query<T_First>(toQuery(this.#source)).all())

    return (this.#resolved = list)
  }
}



function toQuery(s: DomSource): string {
  if (typeof s === 'string') return s
  if (s instanceof HTMLElement) throw new Error('❌ Cannot derive a query from an HTMLElement')
  const q = (s as { query: string | (() => string) }).query
  return typeof q === 'function' ? q() : q
}


export type DomSource =
  | string
  | HTMLElement
  | IdReturn
  | ClassNameReturn
  | DatasetReturn
  | FieldReturn<any>

export type DomVariant = 'one' | 'all'

export type DomPosition = 'append' | 'prepend' | 'before' | 'after'

export type ElementClass<T_First extends HTMLElement> = { new(): T_First }

type Mutate<T extends HTMLElement> = (el: T) => void

type Op = { selector: string; all: boolean; mutate: Mutate<HTMLElement> }
