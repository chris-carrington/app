import * as v from 'valibot'

// ─── schema builders (defined as values so we can derive their types) ──────
const requiredPicklist = <const T extends readonly string[]>(
  values: T,
  errorMissing: string,
  errorInvalid: string,
) =>
  v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, errorMissing),
    v.picklist(values, errorInvalid),
  )

type RequiredSchema<T extends readonly string[]> =
  ReturnType<typeof requiredPicklist<T>>

type OptionalSchema<T extends readonly string[]> =
  v.OptionalSchema<RequiredSchema<T>, undefined>

// ─── props ─────────────────────────────────────────────────────────────────
type SelectBase<T extends readonly string[]> = {
  values: T
  errorInvalid: string
}

type SelectPipeProps<T extends readonly string[]> = SelectBase<T> & (
  | { optional: true; errorMissing?: never }
  | { optional?: false; errorMissing: string }
)

// ─── overloads ─────────────────────────────────────────────────────────────
export function pipeSelect<const T extends readonly string[]>(
  props: SelectPipeProps<T> & { optional: true },
): OptionalSchema<T>

export function pipeSelect<const T extends readonly string[]>(
  props: SelectPipeProps<T> & { optional?: false },
): RequiredSchema<T>

// ─── implementation (loose sig → TS can't complain about compatibility) ────
export function pipeSelect(
  props: SelectPipeProps<readonly string[]>,
): unknown {
  const picklistStep = v.picklist(props.values, props.errorInvalid)

  if (props.optional === true) {
    return v.optional(v.pipe(v.string(), v.trim(), picklistStep))
  }

  return v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, props.errorMissing),
    picklistStep,
  )
}
