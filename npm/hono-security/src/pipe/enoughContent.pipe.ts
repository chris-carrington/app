// app/npm/hono-security/src/pipe/enoughContent.pipe.ts

import * as v from 'valibot'

export const pipeEnoughContent = (props: {
  count: number,
  error: string,
}) => {
  return v.pipe(
    v.string(),
    v.trim(),
    v.minLength(props.count, props.error)
  )
}
