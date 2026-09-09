// app/npm/hono-form/src/pipe/select.pipe.ts
import * as v from 'valibot'

type SelectPipeProps<T extends readonly string[]> = {
  values: T
  errorInvalid: string
} & (
    | { optional: true; errorMissing?: never }               // no errorMissing when optional
    | { optional?: false; errorMissing: string }            // required otherwise
  )

export const pipeSelect = <const T extends readonly string[]>(
  props: SelectPipeProps<T>
) => {
  const picklistStep = v.picklist(props.values, props.errorInvalid)

  if (props.optional === true) {
    // Optional: allow undefined, but if a value is given it must be trimmed and in the picklist
    return v.optional(v.pipe(v.string(), v.trim(), picklistStep))
  } else {
    // Required: must be non‑empty (minLength 1) and in the picklist
    return v.pipe(
      v.string(),
      v.trim(),
      v.minLength(1, props.errorMissing),
      picklistStep
    )
  }
}