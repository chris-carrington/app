import { HonoEvents } from '@hono-events'


export const imgWebpEvents = new HonoEvents<{
  filesTransmuting: boolean,
}>()
