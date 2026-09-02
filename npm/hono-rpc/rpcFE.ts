// app/npm/hono-rpc/rpcFE.ts

import { hc } from 'hono/client'
import type { Hono } from 'hono'


export function rpcFE<T_AppType extends Hono<any, any, any>>() {
  return hc<T_AppType>(window.location.origin)
}

export * from './infer'
