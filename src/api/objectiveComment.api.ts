// app/src/api/objectiveComment.api.ts

import { Hono } from 'hono'
import { validator, onError, onSuccess } from '@hono-api/be'
import { mwSessionPerson } from '@src/middleware/mwSessionPerson'
import { postObjectiveCommentValidator } from '@src/validators/objectiveComment.validator'
import { db, ObjectiveComment, ObjectiveActivity, OBJECTIVE_ACTIVITY_TYPE_ID } from '@src/db'


export default new Hono()
  .post(
    '/',
    validator('json', postObjectiveCommentValidator.schema),
    mwSessionPerson,
    async (c) => {
      const person = c.get('person')
      const data = c.req.valid('json')

      try {
        const commentId = await db.transaction(async (tx) => {
          const { id: commentId } = await tx // insert comment
            .insert(ObjectiveComment)
            .values({ createdBy: person.id, ...data })
            .returning({ id: ObjectiveComment.id })
            .get()

          await tx.insert(ObjectiveActivity).values({ // insert activity
            objectiveId: data.objectiveId,
            typeId: OBJECTIVE_ACTIVITY_TYPE_ID.COMMENT_ADDED,
            actorId: person.id,
            commentId,
          })

          return commentId
        })

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
