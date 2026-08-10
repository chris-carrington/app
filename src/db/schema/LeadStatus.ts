// app/src/db/schema/LeadStatus.ts

import { StaffLead } from './StaffLead'
import { relations } from 'drizzle-orm'
import { ServiceLead } from './ServiceLead'
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Lead status lookup table */
export const LeadStatus = sqliteTable('LeadStatus', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  value: text('value').notNull(),
  isActive: integer('isActive', { mode: 'boolean' }).default(true),
})


export const LeadStatusRelations = relations(LeadStatus, ({ many }) => ({
  serviceLeads: many(ServiceLead),
  staffLeads: many(StaffLead),
}))
