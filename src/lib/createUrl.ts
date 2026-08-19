// app/src/lib/createUrl.ts

import { hc } from 'hono/client'
import { env } from 'cloudflare:workers'
import type { AppType } from '@src/index'


export function createUrl() {
  return hc<AppType>(env.APP_URL)
}
