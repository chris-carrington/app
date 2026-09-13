// app/src/validators/objectiveComment.validator.ts

import * as v from 'valibot'
import { pipeEnoughContent, Validator } from '@hono-form'


export const formObjectiveCommentValidator = new Validator(
  v.object({
    comment: pipeEnoughContent({ count: 6, error: 'Please enter at least 6 characters' }),
  })
)


export const postObjectiveCommentValidator = new Validator(
  v.object({
    objectiveId: v.number(),
    value: pipeEnoughContent({ count: 6, error: 'Please enter at least 6 characters' }),
  })
)
