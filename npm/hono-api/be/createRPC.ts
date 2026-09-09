// app/npm/hono-api/be/createRPC.ts

import { hc } from 'hono/client'
import type { Hono } from 'hono'
import { env } from 'cloudflare:workers'


export function createRPC<T_AppType extends Hono<any, any, any>>() {
  return hc<T_AppType>(env.ORIGIN)
}
