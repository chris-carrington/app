// app/src/objectives/objectives.types.ts

export type ColumnId = number

export type Tag = {
  id: number
  value: string
  bgHex: string
  fgHex: string
}

export type Assignee = {
  id: number
  imageId: string
  firstName: string
  lastName: string
}

export type Objective = {
  id: number
  title: string
  order: number
  columnId: number
  createdAt: string
  assignees?: Assignee[]
  tags?: Tag[]
}

export type KanbanData = Record<ColumnId, Objective[]>

export type DraggedObjectiveInfo = {
  objectiveId: number
  sourceColumnId: ColumnId
}

export type Column = { id: number, value: string }
