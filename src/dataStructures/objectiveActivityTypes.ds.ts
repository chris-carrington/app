// app/src/dataStructures/objectiveActivityTypes.ds.ts

import { flip } from '@src/lib/flip'


export const dsObjectiveActivityTypes = {
  assigneeAdded: 1,
  assigneeRemoved: 2,
  columnChanged: 3,
  tagAdded: 4,
  tagRemoved: 5,
  commentAdded: 6,
  objectiveCreated: 7
} as const


export const dsObjectiveActivityTypesByIds = flip(dsObjectiveActivityTypes)


export const dsObjectiveActivityTypesPerVariant = {
  all: [
    dsObjectiveActivityTypes.columnChanged,
    dsObjectiveActivityTypes.tagAdded,
    dsObjectiveActivityTypes.tagRemoved,
    dsObjectiveActivityTypes.commentAdded,
    dsObjectiveActivityTypes.objectiveCreated,
  ],
  personal: [
    dsObjectiveActivityTypes.assigneeAdded,
    dsObjectiveActivityTypes.assigneeRemoved,
    dsObjectiveActivityTypes.columnChanged,
    dsObjectiveActivityTypes.tagAdded,
    dsObjectiveActivityTypes.tagRemoved,
    dsObjectiveActivityTypes.commentAdded,
  ],
} as const


export type ObjectiveActivityVariant = keyof typeof dsObjectiveActivityTypesPerVariant
