// app/src/api/transparency.api.ts

import { Hono } from 'hono'
import { onSuccess } from '@hono-api/be'
import { queryTransparency } from '@src/transparency/queryTransparency'


export default new Hono()
  .get('/:id', async (c) => {
    const data = await queryTransparency(c.req.param('id'))
    return onSuccess(c, { data })
  })
