// app/src/db/schema/LeadStatus.ts

import { relations } from 'drizzle-orm'
import { StaffLead, JobLead } from '@src/db'
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'


/** Lead status lookup table */
export const LeadStatus = sqliteTable('LeadStatus', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  value: text('value').notNull(),
  isActive: integer('isActive', { mode: 'boolean' }).default(true),
})


export const LeadStatusRelations = relations(LeadStatus, ({ many }) => ({
  jobLeads: many(JobLead),
  staffLeads: many(StaffLead),
}))
