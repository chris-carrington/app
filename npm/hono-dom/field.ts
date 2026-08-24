// app/npm/hono-dom/field.ts

import { FieldProps } from '@hono-security'


export function field<T extends FieldProps['type']>(type: T, name: string, prefix: string) {
  const result = {
    type,
    name,
    prefix,
    query: `#${type}--${prefix}--${name}`,
  } as const

  return {
    ...result,
    attr: () => ({
      type: result.type,
      name: result.name,
      prefix: result.prefix,
    }),
  }
}
