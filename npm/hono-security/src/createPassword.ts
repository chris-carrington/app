// app/npm/hono-security/src/createPassword.ts

import { base64UrlEncode } from '@hono-security'


export function createPassword() {
  const randomBytes = new Uint8Array(64)
  crypto.getRandomValues(randomBytes)

  return base64UrlEncode(randomBytes)
}
