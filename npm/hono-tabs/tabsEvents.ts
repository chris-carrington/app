import { HonoEvents } from '@hono-events'

export const tabsEvents = new HonoEvents<{
  tabChanged: {
    id: string,
    name: string,
    index: number,
  },
}>()
