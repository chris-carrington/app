// app/src/objectives/objectives.types.ts


export type ColumnValue = string;
export type Column = { id: number; value: ColumnValue };
export type Task = { title: string; order: number };
export type KanbanData = Record<ColumnValue, Task[]>;
export type DraggedTaskInfo = { taskTitle: string; sourceColumnValue: ColumnValue };
