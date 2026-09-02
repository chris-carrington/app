// app/src/validators/inupObjective.validator.ts

import * as v from 'valibot'
import { pipeEnoughContent, Validator } from '@hono-security'


export const formObjectiveValidator = new Validator(
  v.object({
    columnId: v.string(),
    title: pipeEnoughContent({ count: 9, error: 'Please enter at least 9 characters' }),
    description: v.optional(v.string()),
    assigneeIds: v.array(v.string()),
    tagIds: v.array(v.string()),
  })
)


export const insertObjectiveValidator = new Validator(
  v.object({
    columnId: v.number(),
    title: pipeEnoughContent({ count: 9, error: 'Please enter at least 9 characters' }),
    description: v.optional(v.string()),
    order: v.number(),
    assigneeIds: v.array(v.number()),
    tagIds: v.array(v.number()),
  })
)


export const updateObjectiveValidator = new Validator(
  v.object({
    id: v.number(),
    columnId: v.optional(v.number()),
    title: v.optional(pipeEnoughContent({ count: 9, error: 'Please enter at least 9 characters' })),
    description: v.optional(v.string()),
    order: v.optional(v.number()),
    assigneeIds: v.optional(v.array(v.number())),
    tagIds: v.optional(v.array(v.number())),
  })
)
