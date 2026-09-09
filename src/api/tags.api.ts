// app/src/api/tags.api.ts

import { Hono } from 'hono'
import { queryTags } from '@src/db'
import { onSuccess } from '@hono-api/be'


export default new Hono()
  .get('/', async (c) => {
    const tags = await queryTags()
    return onSuccess(c, { data: {tags} })
  })
