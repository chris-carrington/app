// app/src/pipe/array.pipe.ts

import * as v from 'valibot'

export const pipeArray = (props: {
  errorMissing: string
  errorInvalid: string
  values: { value: string }[]
}) => {
  const allowedValues = props.values.map(v => v.value)

  return v.pipe(
    v.array(v.picklist(allowedValues, props.errorInvalid)),
    v.minLength(1, props.errorMissing)
  )
}
