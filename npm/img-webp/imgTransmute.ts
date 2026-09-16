// app/npm/img-webp/imgTransmute.ts

import { initWasm } from './initWasm'
import { img_transmute } from './img_webp.js'


/**
 * - Compress an image `File` into a WebP `File` using the img-webp wasm module.
 * - Assumes `file` is an image. Non-image files should be filtered by the caller (see `onFileChange`). Throws if wasm init or encoding fails.
 */
export async function imgTransmute(file: File, cfg: ImgTransmuteConfig = {}): Promise<File> {
  const { aimWidth = null, quality = 0.3 } = cfg

  await initWasm()

  const buf = new Uint8Array(await file.arrayBuffer())
  const processed = img_transmute(buf, aimWidth)

  // Read all wasm getters before freeing.
  const width = processed.width
  const height = processed.height
  // ArrayLike ctor copies into a fresh ArrayBuffer, giving us Uint8ClampedArray<ArrayBuffer>.
  const rgba = new Uint8ClampedArray(processed.pixels)
  processed.free()

  const imageData = new ImageData(rgba, width, height)

  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Failed to get 2d context')

  ctx.putImageData(imageData, 0, 0)

  const blob = await canvas.convertToBlob({ type: 'image/webp', quality })

  const base = file.name.replace(/\.[^.]+$/, '') || 'image'
  const newName = `${base}.webp`

  return new File([blob], newName, {
    type: blob.type,
    lastModified: file.lastModified,
  })
}


export type ImgTransmuteConfig = {
  /**
   * - Optional
   * - IF undefined THEN no resize
   * - ELSE IF provided image width < aimWidth THEN no resize
   * - ELSE set new image width to aimWidth
   */
  aimWidth?: number
  /** 
   * - WebP encoder quality, 0..1. Default: 0.3 (30%)
   * - 30% surprisingly looks exactly like the original image
    */
  quality?: number
}
