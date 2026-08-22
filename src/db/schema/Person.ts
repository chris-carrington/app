// app/src/db/schema/Person.ts

import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Store all people in our system (students, mentors, customers, Trustees, Board members, employees, vendors, etc.) */
export const Person = sqliteTable('Person', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('firstName').notNull(),
  lastName: text('lastName').notNull(),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
  imageId: text('imageId'),
})
