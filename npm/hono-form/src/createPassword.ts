// app/npm/hono-form/src/createPassword.ts

import { base64UrlEncode } from '@hono-form'


export function createPassword() {
  const randomBytes = new Uint8Array(64)
  crypto.getRandomValues(randomBytes)

  return base64UrlEncode(randomBytes)
}
