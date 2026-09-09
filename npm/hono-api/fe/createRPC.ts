// app/npm/hono-api/fe/createRPC.ts

import { hc } from 'hono/client'
import type { Hono } from 'hono'


export function createRPC<T_AppType extends Hono<any, any, any>>() {
  return hc<T_AppType>(window.location.origin)
}
