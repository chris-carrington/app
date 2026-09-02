// app/npm/hono-rpc/rpcBE.ts

import { hc } from 'hono/client'
import type { Hono } from 'hono'
import { env } from 'cloudflare:workers'


export function rpcBE<T_AppType extends Hono<any, any, any>>() {
  return hc<T_AppType>(env.ORIGIN)
}

export * from './infer'
