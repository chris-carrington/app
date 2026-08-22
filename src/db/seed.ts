// app/src/db/seed.ts

import { db, Trade, JobStatus, LeadStatus, StaffPosition, StaffEndReason, ObjectiveColumn, ObjectiveTag } from '@src/db'


const trades = [
  { value: 'Bathroom' },
  { value: 'Carpentry' },
  { value: 'Cobb Interior' },
  { value: 'Cobb Siding' },
  { value: 'Concrete' },
  { value: 'Deck' },
  { value: 'Doors' },
  { value: 'Drywall' },
  { value: 'Electrical' },
  { value: 'Fence' },
  { value: 'Floors' },
  { value: 'Foundation' },
  { value: 'Gutters' },
  { value: 'HVAC' },
  { value: 'Insulation' },
  { value: 'Kitchen' },
  { value: 'Painting' },
  { value: 'Plumbing' },
  { value: 'Roofing' },
  { value: 'Siding' },
  { value: 'Tiling' },
  { value: 'Waterproofing' },
  { value: 'Windows' },
]

const staffPositions = [
  { value: 'Trustee', isHiring: false },
  { value: 'President', isHiring: false },
  { value: 'Secretary', isHiring: false },
  { value: 'Treasurer', isHiring: false },
  { value: 'Executitve Director', isHiring: false },
  { value: 'CTO', isHiring: false },
  { value: 'CFO', isHiring: true },
  { value: 'Tradesperson', isHiring: true },
  { value: 'Zoom Mentor', isHiring: false },
  { value: 'Study Guide Maintainer', isHiring: false },
]

const leadStatuses = [
  { value: 'New' },
  { value: 'Contacted' },
  { value: 'Won' },
  { value: 'Lost' },
  { value: 'Closed' },
]

const staffEndReasons = [
  { value: 'Resigned' },
  { value: 'Quit' },
  { value: 'Laid Off' },
  { value: 'Fired' },
  { value: 'Role Change' },
]

const jobStatuses = [
  { value: 'Prospecting', description: 'When a potential client first reaches out' },
  { value: 'Estimating', description: 'After initial conversation, before sending a bid' },
  { value: 'Bid Sent', description: 'Bid has been sent to the client & waiting for client decision' },
  { value: 'Negotiating', description: 'Client is interested but wants to adjust scope or price' },
  { value: 'Won', description: 'Client has accepted the bid, contract signed' },
  { value: 'Scheduling', description: `Job is won, we're coordinating dates and logistics` },
  { value: 'Active', description: 'Work is actively in progress' },
  { value: 'Paused', description: 'Work is temporarily stopped (e.g., weather, materials delay)' },
  { value: 'Review', description: 'Work is complete and undergoing quality inspection' },
  { value: 'Completed', description: 'Job is finished and accepted' },
  { value: 'Invoiced', description: 'Final invoice has been sent to client' },
  { value: 'Paid', description: 'Client has paid in full' },
  { value: 'Cancelled', description: 'Client cancels, or we decide not to proceed' },
  { value: 'Lost', description: 'Client chose someone else' },
]

const objectiveColumns = [
  { value: 'To Do' },
  { value: 'In Progress' },
  { value: 'Completed' },
]

const objectiveTags = [
  { value: 'In Development', order: 1, bgHex: '#DBEAFE', fgHex: '#1E40AF' },
  { value: 'Ready for QA', order: 2, bgHex: '#EDE9FE', fgHex: '#5B21B6' },
  { value: 'In QA', order: 3, bgHex: '#FEF3C7', fgHex: '#92400E' },
  { value: 'Failed QA', order: 4, bgHex: '#FEE2E2', fgHex: '#991B1B' },
  { value: 'Passed QA', order: 5, bgHex: '#DCFCE7', fgHex: '#166534' },
  { value: 'Completed', order: 6, bgHex: '#CFFAFE', fgHex: '#155E75' },
  { value: 'Archived', order: 7, bgHex: '#F1F5F9', fgHex: '#475569' }
]

await Promise.all([
  db.insert(Trade).values(trades),
  db.insert(StaffPosition).values(staffPositions),
  db.insert(LeadStatus).values(leadStatuses),
  db.insert(StaffEndReason).values(staffEndReasons),
  db.insert(JobStatus).values(jobStatuses),
  db.insert(ObjectiveColumn).values(objectiveColumns),
  db.insert(ObjectiveTag).values(objectiveTags),
])

console.log('✅ Database seed complete!')
