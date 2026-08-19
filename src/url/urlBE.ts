// app/src/url/urlBE.ts

import { hc } from 'hono/client'
import { env } from 'cloudflare:workers'
import type { AppType } from '@src/index'


export function urlBE() {
  return hc<AppType>(env.ORIGIN)
}
