// app/src/api/objectiveComment.api.ts

import { Hono } from 'hono'
import { validator, onError, onSuccess } from '@hono-api/be'
import { db, ObjectiveComment, ObjectiveActivity } from '@src/db'
import { mwSessionPerson } from '@src/middleware/mwSessionPerson'
import { dsObjectiveActivityTypes } from '@src/dataStructures/objectiveActivityTypes.ds'
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
        const commentId = await db.transaction(async (tx) => {
          const { id: commentId } = await tx // insert comment
            .insert(ObjectiveComment)
            .values({ createdBy: person.id, ...data })
            .returning({ id: ObjectiveComment.id })
            .get()

          await tx.insert(ObjectiveActivity).values({ // insert activity
            objectiveId: data.objectiveId,
            typeId: dsObjectiveActivityTypes.commentAdded,
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
