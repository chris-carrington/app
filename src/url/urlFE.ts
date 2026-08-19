// app/src/url/urlFE.ts

import { hc } from 'hono/client'
import type { AppType } from '@src/index'


export function urlFE() {
  return hc<AppType>(window.location.origin)
}
