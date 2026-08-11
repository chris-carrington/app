// app/src/db/seed.ts

import { db, Trade, LeadStatus, StaffPosition, StaffEndReason } from '@src/db'


const trades = [
  { value: 'Bathroom' },
  { value: 'Carpentry' },
  { value: 'Concrete' },
  { value: 'Deck' },
  { value: 'Doors' },
  { value: 'Drywall' },
  { value: 'Electrical' },
  { value: 'Fence' },
  { value: 'Flooring' },
  { value: 'Kitchen' },
  { value: 'Plumbing' },
  { value: 'Roofing' },
  { value: 'Siding' },
  { value: 'Tiling' },
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

const endReasons = [
  { value: 'Resigned' },
  { value: 'Quit' },
  { value: 'Laid Off' },
  { value: 'Fired' },
  { value: 'Role Change' },
]

await Promise.all([
  db.insert(Trade).values(trades),
  db.insert(StaffPosition).values(staffPositions),
  db.insert(LeadStatus).values(leadStatuses),
  db.insert(StaffEndReason).values(endReasons),
])
