// app/src/dataStructures/objectiveTags.ds.ts

import { flip } from '@src/lib/flip'

export const dsObjectiveTags = {
  inDevelopment: { id: 1, label: 'In Development' },
  readyForQa: { id: 2, label: 'Ready for QA' },
  inQa: { id: 3, label: 'In QA' },
  failedQa: { id: 4, label: 'Failed QA' },
  passedQa: { id: 5, label: 'Passed QA' },
  completed: { id: 6, label: 'Completed' },
  archived: { id: 7, label: 'Archived' },
} as const

export const dsObjectiveTagsByIds = flip(dsObjectiveTags, 'id')

export type ObjectiveTags = keyof typeof dsObjectiveTags
