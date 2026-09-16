// app/npm/img-webp/initWasm.ts

import init from './img_webp.js'


/**
 * Lazily initialize the wasm module. Cached so it only runs once per page.
 * Safe to call from anywhere; subsequent calls reuse the same promise.
 */
export function initWasm(): Promise<unknown> {
  if (!wasmInitPromise) wasmInitPromise = init()
  return wasmInitPromise
}


let wasmInitPromise: Promise<unknown> | undefined
