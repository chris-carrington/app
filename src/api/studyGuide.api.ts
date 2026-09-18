// app/src/api/studyGuide.api.ts

import { Hono } from 'hono'
import { onSuccess } from '@hono-api/be'
import { queryStudyGuide } from '@src/mastery/queryStudyGuide'


export default new Hono()
  .get('/:id', async (c) => {
    const data = await queryStudyGuide(c.req.param('id'))
    return onSuccess(c, { data })
  })
