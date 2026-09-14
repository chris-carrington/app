// app/src/api/test.api.ts

import { Hono } from 'hono'
import { onSuccess } from '@hono-api/be'
import { env } from 'cloudflare:workers'


export default new Hono()
  .post(
    '/',
    async (c) => {
      await env.R2.put('test.txt', 'Hello World')

      return onSuccess(c)
    }
  )
