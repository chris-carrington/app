// app/src/lib/tags.api.ts

import { Hono } from 'hono'
import { queryTags } from '@src/db'


export default new Hono()
  .get('/', async (c) => {
    return c.json(await queryTags())
  })
