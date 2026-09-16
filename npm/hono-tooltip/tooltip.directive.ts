// app/npm/hono-tooltip/tooltip.directive.ts

import { rafSchedule } from '@on-time'

let tooltipIdCounter = 0


export default (el: HTMLElement, position: TooltipPosition, content: string) => {
  createTooltipController(el, position, content)
}


function createTooltipController(aimElement: HTMLElement, position: TooltipPosition, content: string) {
  const id = generateTooltipId()

  const tooltipElement = createTooltipElement(id, content)
  tooltipElement.classList.add('position-' + position)
  document.body.appendChild(tooltipElement)

  aimElement.setAttribute('aria-describedby', id)

  let hideTimeoutId: number | undefined

  positionTooltip(aimElement, tooltipElement, position)

  const showNow = () => {
    window.clearTimeout(hideTimeoutId)
    hideTimeoutId = undefined
    positionTooltip(aimElement, tooltipElement, position)
    tooltipElement.classList.add('visible')
    tooltipElement.setAttribute('aria-hidden', 'false')
  }

  const hideNow = () => {
    window.clearTimeout(hideTimeoutId)
    hideTimeoutId = undefined
    tooltipElement.classList.remove('visible')
    tooltipElement.setAttribute('aria-hidden', 'true')
  }

  const scheduleHideNow = () => {
    window.clearTimeout(hideTimeoutId)
    hideTimeoutId = window.setTimeout(hideNow, 100)
  }

  const cancelScheduledHide = () => {
    window.clearTimeout(hideTimeoutId)
    hideTimeoutId = undefined
  }

  const onAimPointerEnter = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return
    showNow()
  }

  const onAimPointerLeave = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return
    scheduleHideNow()
  }

  const onAimFocus = () => showNow()
  const onAimBlur = () => scheduleHideNow()

  const onAimTap = (e: PointerEvent) => {
    if (e.pointerType !== 'touch') return
    if (tooltipElement.classList.contains('visible')) {
      hideNow()
    } else {
      showNow()
    }
  }

  const onTooltipPointerEnter = () => cancelScheduledHide()
  const onTooltipPointerLeave = () => scheduleHideNow()

  const onEscape = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return
    if (!tooltipElement.classList.contains('visible')) return
    hideNow()
  }

  const onDocumentPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== 'touch') return
    if (!aimElement.contains(e.target as Node) && !tooltipElement.contains(e.target as Node)) hideNow()
  }

  const repositionIfVisible = rafSchedule(() => {
    if (tooltipElement.classList.contains('visible')) {
      positionTooltip(aimElement, tooltipElement, position)
    }
  })

  document.addEventListener('keydown', onEscape)
  document.addEventListener('pointerdown', onDocumentPointerDown)

  window.addEventListener('resize', repositionIfVisible)
  window.addEventListener('scroll', repositionIfVisible, true)

  aimElement.addEventListener('pointerdown', onAimTap)
  aimElement.addEventListener('pointerenter', onAimPointerEnter)
  aimElement.addEventListener('pointerleave', onAimPointerLeave)
  aimElement.addEventListener('focus', onAimFocus)
  aimElement.addEventListener('blur', onAimBlur)

  tooltipElement.addEventListener('pointerenter', onTooltipPointerEnter)
  tooltipElement.addEventListener('pointerleave', onTooltipPointerLeave)
}


function createTooltipElement(id: string, content: string) {
  const tooltipElement = document.createElement('div')
  tooltipElement.id = id
  tooltipElement.className = 'hono-tooltip'
  tooltipElement.setAttribute('role', 'tooltip')
  tooltipElement.setAttribute('aria-hidden', 'true')

  const arrowElement = document.createElement('div')
  arrowElement.className = 'arrow'

  const contentElement = document.createElement('div')
  contentElement.className = 'content'
  contentElement.textContent = content

  tooltipElement.appendChild(arrowElement)
  tooltipElement.appendChild(contentElement)
  return tooltipElement
}


function positionTooltip(aimElement: HTMLElement, tooltipElement: HTMLDivElement, position: TooltipPosition) {
  const coordinates = computeTooltipCoordinates(aimElement, tooltipElement, position)
  applyTooltipCoordinates(tooltipElement, coordinates)
}


function computeTooltipCoordinates(aimElement: HTMLElement, tooltipElement: HTMLDivElement, position: TooltipPosition) {
  const aimRect = aimElement.getBoundingClientRect()
  const tooltipWidth = tooltipElement.offsetWidth
  const tooltipHeight = tooltipElement.offsetHeight

  const aimTop = aimRect.top
  const aimLeft = aimRect.left
  const aimRight = aimRect.right
  const aimBottom = aimRect.bottom
  const aimCenterX = aimLeft + aimRect.width / 2

  const coordinates = { top: 0, left: 0 }

  switch (position) {
    case 'topLeft':
      coordinates.top = aimTop - tooltipHeight
      coordinates.left = aimLeft
      break
    case 'topRight':
      coordinates.top = aimTop - tooltipHeight
      coordinates.left = aimRight - tooltipWidth
      break
    case 'bottomLeft':
      coordinates.top = aimBottom
      coordinates.left = aimLeft
      break
    case 'bottomRight':
      coordinates.top = aimBottom
      coordinates.left = aimRight - tooltipWidth
      break
    case 'bottomCenter':
      coordinates.top = aimBottom
      coordinates.left = aimCenterX - tooltipWidth / 2
      break
    case 'topCenter':
      coordinates.top = aimTop - tooltipHeight
      coordinates.left = aimCenterX - tooltipWidth / 2
      break
  }

  return coordinates
}


function applyTooltipCoordinates(tooltipElement: HTMLDivElement, coordinates: { top: number, left: number }) {
  tooltipElement.style.top = coordinates.top + 'px'
  tooltipElement.style.left = coordinates.left + 'px'
}



function generateTooltipId() {
  tooltipIdCounter += 1
  return 'hono-tooltip-' + tooltipIdCounter
}


export type TooltipPosition = 'topCenter' | 'bottomCenter' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
