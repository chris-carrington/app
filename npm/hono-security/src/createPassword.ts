import { base64UrlEncode } from './base64UrlEncode'


export function createPassword() {
  const randomBytes = new Uint8Array(64)
  crypto.getRandomValues(randomBytes)

  return base64UrlEncode(randomBytes)
}
