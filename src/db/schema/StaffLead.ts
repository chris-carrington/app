// app/src/db/schema/StaffLead.ts

import { sql, relations } from 'drizzle-orm'
import { Person, LeadStatus, StaffPosition } from '@src/db'
import { sqliteTable, integer } from 'drizzle-orm/sqlite-core'


/** Store entries from our staff interest form */
export const StaffLead = sqliteTable('StaffLead', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  personId: integer('personId')
    .notNull()
    .references(() => Person.id),
  statusId: integer('statusId')
    .notNull()
    .references(() => LeadStatus.id),
  positionId: integer('positionId')
    .notNull()
    .references(() => StaffPosition.id),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
})


export const StaffLeadRelations = relations(StaffLead, ({ one }) => ({
  person: one(Person, {
    fields: [StaffLead.personId],
    references: [Person.id],
  }),
  status: one(LeadStatus, {
    fields: [StaffLead.statusId],
    references: [LeadStatus.id],
  }),
  position: one(StaffPosition, {
    fields: [StaffLead.positionId],
    references: [StaffPosition.id],
  }),
}))
