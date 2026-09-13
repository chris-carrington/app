// app/src/api/objectiveComment.api.ts

import { Hono } from 'hono'
import { db, ObjectiveComment } from '@src/db'
import { validator, onError, onSuccess } from '@hono-api/be'
import { mwSessionPerson } from '@src/middleware/mwSessionPerson'
import { postObjectiveCommentValidator } from '@src/validators/objectiveComment.validator'


export default new Hono()
  .post(
    '/',
    validator('json', postObjectiveCommentValidator.schema),
    mwSessionPerson,
    async (c) => {
      const person = c.get('person')
      const data = c.req.valid('json')

      try {
        const { id: commentId } = await db
          .insert(ObjectiveComment)
          .values({ createdBy: person.id, ...data })
          .returning({ id: ObjectiveComment.id })
          .get()

        const response = {
          commentId,
          firstName: person.firstName,
          lastName: person.lastName,
          imageId: person.imageId,
        }

        return onSuccess(c, { data: response })
      } catch (e) {
        return onError(c, { e })
      }
    })
