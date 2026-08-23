// app/src/objectives/objectiveAddEdit.validator.ts

import * as v from 'valibot'
import { kanbanColumns } from '@src/lib/vars'
import { createValidator, pipeSelect, pipeEnoughContent, type InferValidator } from '@hono-security'


export const ObjectiveAddEditSchema = v.object({
  title: pipeEnoughContent({
    count: 9,
    error: 'Please include at least 9 characters'
  }),
  column: pipeSelect({
    values: kanbanColumns.map(c => ({ value: String(c.id) })),
    errorMissing: 'Please select a column',
    errorInvalid: 'Please select a valid column',
  })
})

export const objectiveAddEditValidator = createValidator(ObjectiveAddEditSchema)

export type ObjectiveAddEditFormData = InferValidator<typeof objectiveAddEditValidator>
