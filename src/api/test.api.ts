// app/src/api/test.api.ts

import { Hono } from 'hono'
import { onSuccess } from '@hono-api/be'
import { env } from 'cloudflare:workers'


export default new Hono()
  .post(
    '/',
    async (c) => {
      const x = await env.R2.get('5587065e-0d3f-4e35-bbb3-70a14d1e683b.webp')
console.log(x)
      return onSuccess(c)
    }
  )
