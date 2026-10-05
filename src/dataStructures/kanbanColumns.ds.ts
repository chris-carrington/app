// app/src/dataStructures/kanbanColumns.ds.ts

import type { ObjectiveColumn } from '@src/db'

export const dsKanbanColumns: typeof ObjectiveColumn.$inferSelect[] = [
  { id: 1, value: 'To Do', isActive: true },
  { id: 2, value: 'In Progress', isActive: true },
  { id: 3, value: 'Completed', isActive: true }
]