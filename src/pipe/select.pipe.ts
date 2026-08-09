// app/src/pipe/select.pipe.ts

import * as v from 'valibot'

export const pipeSelect = (props: {
  errorMissing: string,
  errorInvalid: string,
  values: { value: string }[]
}) => {
  return v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, props.errorMissing),
    v.picklist(props.values.map(v => v.value), props.errorInvalid)
  )
}
