// app/npm/img-webp/onFileChange.ts

import { imgTransmute, type ImgTransmuteConfig } from './imgTransmute'
import { imgWebpEvents } from './imgWebpEvents'


/**
 * Per-input token map so we can ignore stale async runs without leaking memory.
 * (e.g. user picks file A, then quickly picks file B before A finishes.)
 */
const tokens = new WeakMap<HTMLInputElement, number>()


/**
 * Handle a file input's `change` event by replacing any image files in
 * `el.files` with compressed WebP versions. Non-image files pass through
 * untouched. Errors on individual files are logged and the original is kept.
 *
 * @example
  ```ts
  import { onFileChange } from '@img-webp'

  input.addEventListener('change', () => onFileChange(input, { aimWidth: 1200 }))
  ```
 */
export async function onFileChange(el: HTMLInputElement, cfg?: ImgTransmuteConfig): Promise<void> {
  const files = el.files
  if (!files || files.length === 0) return

  const token = (tokens.get(el) ?? 0) + 1
  tokens.set(el, token)

  const output: File[] = []

  imgWebpEvents.emit('filesTransmuting', true)

  for (const file of Array.from(files)) {
    if (!file.type.startsWith('image/')) {
      output.push(file)
      continue
    }

    try {
      output.push(await imgTransmute(file, cfg))
    } catch (e) {
      console.warn('[img-webp] failed to compress', file.name, e)
      output.push(file)
    }
  }

  imgWebpEvents.emit('filesTransmuting', false)

  // Ignore this run if a newer change event has started.
  if (tokens.get(el) !== token) return

  const dt = new DataTransfer()
  for (const f of output) dt.items.add(f)
  el.files = dt.files
}
