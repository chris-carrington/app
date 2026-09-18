// app/npm/hono-tabs/tabs.directive.ts

import { query } from '@hono-dom'
import { tabsEvents } from './tabsEvents'


export default (el: HTMLDivElement) => {
  const name = el.dataset.tabs ?? ''

  const elInner = query<HTMLElement>('.tabs__inner').one()
  const marker = query<HTMLElement>('.tabs__marker').root(elInner).one()
  const elTabs = Array.from(query<HTMLElement>('.tabs__tab').root(elInner).many())

  const elContents = Array.from(
    query<HTMLElement>('.tabs__content').root(el).many()
  )

  if (elTabs.length === 0) return () => {}

  const isUnderline = el.dataset.tabsVariant === 'underline'

  let active = elTabs.findIndex((tabEl) => tabEl.getAttribute('aria-selected') === 'true')
  if (active < 0) active = 0


  new Tabs(name, elInner, elTabs, active, elContents, marker, isUnderline)
}


class Tabs {
  name: string
  elTabs: HTMLElement[]
  elInner: HTMLElement
  active: number
  elContents: HTMLElement[]
  marker: HTMLElement | null
  isUnderline: boolean


  constructor(name: string, elInner: HTMLElement, elTabs: HTMLElement[], active: number, elContents: HTMLElement[], marker: HTMLElement | null, isUnderline: boolean) {
    this.name = name
    this.elInner = elInner
    this.elTabs = elTabs
    this.active = active
    this.elContents = elContents
    this.marker = marker
    this.isUnderline = isUnderline

    this.render()
    this.bindResizeObserver()
    this.bindOnClick()
  }


  render() {
    this.elTabs.forEach((tabEl, i) => {
      const on = i === this.active
      tabEl.classList.toggle('tabs__active', on)
      tabEl.setAttribute('aria-selected', on ? 'true' : 'false')
      tabEl.tabIndex = on ? 0 : -1
    })

    this.elContents.forEach((panelEl, i) => {
      panelEl.classList.toggle('tabs__active', i === this.active)
    })

    this.positionMarker()
  }


  positionMarker() {
    if (!this.marker) return

    const tabEl = this.elTabs[this.active]
    if (!tabEl) return

    this.marker.style.width = `${tabEl.offsetWidth}px`
    this.marker.style.transform = `translateX(${tabEl.offsetLeft}px)`

    // `underline` gets its height from CSS (a thin bottom bar)
    if (!this.isUnderline) this.marker.style.height = `${tabEl.offsetHeight}px`
  }


  bindResizeObserver() {
    const resizeObserver = new ResizeObserver(() => this.positionMarker())
    resizeObserver.observe(this.elInner)
  }


  bindOnClick() {
    this.elInner.addEventListener('click', e => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('.tabs__tab')
      if (!target || !this.elInner?.contains(target)) return

      const index = this.elTabs.indexOf(target)
      if (index < 0) return

      this.setActive(index)
    })

  }


  setActive(index: number) {
    if (index < 0 || index >= this.elTabs.length) return

    const changed = index !== this.active
    this.active = index

    this.render()

    if (changed) {
      tabsEvents.emit('tabChanged', { id: this.#tabIdAt(index), name: this.name, index })
    }
  }


  #tabIdAt( index: number): string {
    const tabId = this.elTabs[index]?.dataset.tabId
    if (!tabId) throw new Error('!tabId')
    return tabId
  }
}
