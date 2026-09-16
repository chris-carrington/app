// app/npm/on-time/rafSchedule.ts

/**
 * - Fire on the next frame, coalesce bursts
 * - Scroll, resize that changes appearance, drag → `rafSchedule()` (requestAnimationFrame)
 * - On done typing, resize that changes expensive computation → `debounce()`
 * - Resize Tip: is the work visual and needs to be tracked continuously (`rafSchedule`), or is it heavy and only correct at the final size (`debounce`)
 * @param fn The function to throttle
 * @returns A function to pass to listeners
 * @example
  ```
  const repositionIfVisible = rafSchedule(() => {
    if (tooltipElement.classList.contains('visible')) {
      positionTooltip(aimElement, tooltipElement, position)
    }
  })

  window.addEventListener('scroll', repositionIfVisible, true) // true on scroll = capture phase, so it also fires for scrolls inside nested scrollable containers, resize doesn't need it
  window.addEventListener('resize', repositionIfVisible)
  ```
 */
export function rafSchedule<T extends (...args: any[]) => void>(fn: T) {
  let frameId: number | undefined
  let lastArgs: Parameters<T> | undefined

  const throttled = (...args: Parameters<T>) => {
    lastArgs = args

    if (frameId === undefined) {
      frameId = requestAnimationFrame(() => {
        frameId = undefined

        if (lastArgs) {
          fn(...lastArgs)
          lastArgs = undefined
        }
      })
    }
  }

  throttled.cancel = () => {
    if (frameId !== undefined) {
      cancelAnimationFrame(frameId)
      frameId = undefined
    }

    lastArgs = undefined
  }

  return throttled
}
