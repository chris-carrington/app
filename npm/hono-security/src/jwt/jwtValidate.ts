// app/npm/hono-security/src/jwt/jwtValidate.ts

import { base64UrlDecodeToBinary, base64UrlDecodeToString, type BaseJWTPayload } from '@hono-security'


/**
 * ### Validate a JWT in node or on the Edge (Cloudflare Workers)
 * @param props.jwt - The jwt token to verify
 * @param props.secret - Optional, defaults to process.env.JWT_SECRET, secret to pass to `crypto.subtle.importKey()`
 * @returns 🚨 A promise resolving to:  
 *     - `{ isValid: true, payload }` on success, payload automatically includes `iat` (issued time in seconds) & `exp` (expiration in seconds)
 *     - `{ isValid: false, payload, errorId, errorMessage }` on failure
 */
export async function jwtValidate<T_JWTPayload extends BaseJWTPayload = {}>({ jwt, secret }: {
  /** The jwt token to verify */
  jwt?: string,
  /** Optional, defaults to process.env.JWT_SECRET, secret to pass to `crypto.subtle.importKey()` */
  secret?: string
}): Promise<JWTValidateResponse<T_JWTPayload>> {
  if (!jwt) return error('FALSY_JWT', 'JWT not provided')

  const parts = jwt.split('.')
  if (parts.length !== 3) return error('INVALID_PARTS', 'JWT must have 3 parts')

  const [headerB64, bodyB64, sigB64] = parts
  if (!headerB64 || !bodyB64 || !sigB64) return error('INVALID_PARTS', 'JWT must have 3 truthy parts')

  const encoder = new TextEncoder()

  const headerBodyBinary = encoder.encode(`${headerB64}.${bodyB64}`)
  const sigBinary = base64UrlDecodeToBinary(sigB64)
  const secretBinary = encoder.encode(secret ?? process.env.JWT_SECRET)

  const cryptoKey = await crypto.subtle.importKey('raw', secretBinary, { name: 'HMAC', hash: 'SHA-512' }, false, ['verify'])

  const isValid = await crypto.subtle.verify('HMAC', cryptoKey, new Uint8Array(sigBinary), headerBodyBinary)

  const payload = JSON.parse(base64UrlDecodeToString(bodyB64)) as FullJWTPayload<T_JWTPayload>

  if (!isValid) return error('INVALID_JWT', 'JWT is invalid', payload)

  const now = Math.floor(Date.now() / 1000)

  if (typeof payload.exp !== 'number') return error('INVALID_EXP', 'Exp must be a number', payload)

  if (payload.exp < now) return error('EXPIRED', 'Token is expired', payload)

  const jwtResponse: JWTValidateSuccess<T_JWTPayload> = { isValid: true, payload }

  return jwtResponse
}


function error<T_JWTPayload extends BaseJWTPayload = {}>(errorId: JWTValidateFailure['errorId'], errorMessage: string, payload?: FullJWTPayload<T_JWTPayload>): JWTValidateFailure<T_JWTPayload> {
  return { isValid: false, errorId, errorMessage, payload }
}


/** The `props` that are provided to `jwtValidate()` */
export type JWTValidateProps = {
  /** The jwt token to verify */
  jwt?: string,
  /** Optional, defaults to process.env.JWT_SECRET, secret to pass to `crypto.subtle.importKey()` */
  secret?: string
}


/**
 * - The `FullJWTPayload` adds `{iat: number, exp: number}` to the payload to align w/ the `JWT spec (RFC 7519)`
 * - The `T_JWTPayload` is the data shape in the `jwt` excluding `iat` & `exp`
 */
export type FullJWTPayload<T_JWTPayload extends BaseJWTPayload = {}> = T_JWTPayload & { iat: number, exp: number }


/** What `jwtValidate()` returns */
export type JWTValidateResponse<T_JWTPayload extends BaseJWTPayload = {}> = JWTValidateSuccess<T_JWTPayload> | JWTValidateFailure<T_JWTPayload>


/** Shape of an invalid `jwtValidate()` response */
export type JWTValidateFailure<T_JWTPayload extends BaseJWTPayload = {}> = {
  isValid: false
  payload?: FullJWTPayload<T_JWTPayload>
  errorId: 'FALSY_JWT' | 'INVALID_PARTS' | 'INVALID_EXP' | 'INVALID_JWT' | 'EXPIRED'
  errorMessage: string
}


/** Shape of an valid `jwtValidate()` response */
export type JWTValidateSuccess<T_JWTPayload extends BaseJWTPayload = {}> = {
  isValid: true
  payload: FullJWTPayload<T_JWTPayload>
  errorId?: never
  errorMessage?: never
}
