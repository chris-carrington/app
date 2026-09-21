// app/src/dataStructures/objectiveColumns.ds.ts

import { flip } from '@src/lib/flip'

export const dsObjectiveColumns = {
  todo: { id: 1, label: 'Todo' },
  inProgress: { id: 2, label: 'In Progress' },
  completed: { id: 3, label: 'Completed' },
} as const

export const dsObjectiveColumnsByIds = flip(dsObjectiveColumns, 'id')

export type ObjectiveColumns = keyof typeof dsObjectiveColumns
