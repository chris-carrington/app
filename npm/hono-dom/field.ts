// app/npm/hono-dom/field.ts

import { FieldProps } from '@hono-security'


export function field<T_Type extends FieldProps['type']>(type: T_Type, name: string, prefix: string): FieldReturn<T_Type> {
  const baseQuery = `#${type}--${prefix}--${name}`

  const query = (type === 'checkbox')
    ? ((value?: string) => value ? `${baseQuery}--${value}` : `#fieldset--${prefix}--${name}`)
    : baseQuery

  const result = { type, name, prefix, query } as const

  return {
    ...result,
    attr: () => ({
      type: result.type,
      name: result.name,
      prefix: result.prefix,
    }),
  } as FieldReturn<T_Type>
}


export type FieldReturn<T_Type extends FieldProps['type']> = {
  type: T_Type
  name: string
  prefix: string
  query: FieldQuery<T_Type>
  attr: () => { type: T_Type, name: string, prefix: string }
}


export type FieldQuery<T_Type extends FieldProps['type']> = T_Type extends 'checkbox'
  ? (value?: string) => string
  : string
