// app/npm/hono-security/src/pipe/select.pipe.ts

import * as v from 'valibot'


export const pipeSelect = <const T extends readonly string[]>(props: {
  errorMissing: string
  errorInvalid: string
  values: T
  optional?: boolean
}) => {
  const basePipe = v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, props.errorMissing),
    v.picklist(props.values, props.errorInvalid)
  )

  return props.optional ? v.optional(basePipe) : basePipe
}
