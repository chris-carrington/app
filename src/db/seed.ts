// app/src/db/seed.ts

import { db, Trade, StaffPosition } from '@src/db'

const trades = [
  { value: 'Reclaimed Lumber Construction' },
  { value: 'Fence' },
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
]

await db.insert(Trade).values(trades).onConflictDoNothing()
await db.insert(StaffPosition).values(staffPositions).onConflictDoNothing()
