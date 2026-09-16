// app/npm/on-time/debounce.ts

/**
 * - Debounce fires after someone stops doing x 
 * - Scroll, resize that changes appearance, drag → `rafSchedule()` (requestAnimationFrame)
 * - On done typing, resize that changes expensive computation → `debounce()`
 * - Resize Tip: is the work visual and needs to be tracked continuously (`rafSchedule`), or is it heavy and only correct at the final size (`debounce`)
 * @param fn The function to debounce
 * @param delay How many milliseconds after someone stops doing x do we want the debounce function to run
 * @returns A function to pass to listeners
 * @example
  ```
  const onSearch = debounce((value: string) => {
    console.log('searching for:', value)
  }, 300)

  input.addEventListener('input', (e) => {
    onSearch(input.value)
  })

  // onSearch.cancel()
  ```
 */
export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeoutId: number | undefined

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId)
    }

    timeoutId = window.setTimeout(() => {
      timeoutId = undefined
      fn(...args)
    }, delay)
  }

  debounced.cancel = () => {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId)
      timeoutId = undefined
    }
  }

  return debounced
}
