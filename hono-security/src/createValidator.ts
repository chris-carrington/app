// app/hono-security/src/createValidator.ts

import * as v from 'valibot'


/**
 * Creates a fully‑featured validator from a Valibot object schema
 * Returns utilities for client‑side field validation, full‑object validation and the raw schema for server middleware
 *
 * @param schema - A Valibot object schema (v.object(...))
 * @param defaultError - Fallback error message (default: 'Invalid value')
 */
export function createValidator<T extends v.ObjectSchema<any, any>>(schema: T, defaultError = 'Invalid value'): Validator<v.InferOutput<T>> {
  type Output = v.InferOutput<T>

  function validateField<K extends keyof Output>(name: K, value: unknown): string | null {
    const fieldSchema = v.object({
      [name]: schema.entries[name],
    })
  
    const result = v.safeParse(fieldSchema, { [name]: value })
  
    if (!result.success) {
      const issue = result.issues.find((i: any) => i.path?.[0]?.key === name)
      return issue?.message || defaultError
    }

    return null
  }

  /** Validate a full object – returns a discriminated union. */
  function safeParse(arg: HTMLFormElement | unknown): { success: true, data: Output } | { success: false, errors: Record<string, string> } {
    const data = getSafeParseData(arg)

    const result = v.safeParse(schema, data)

    if (result.success) {
      return { success: true, data: result.output as Output }
    }

    const errors: Record<string, string> = {}

    result.issues.forEach((issue: any) => {
      const key = issue.path?.[0]?.key
      if (typeof key === 'string' && !errors[key]) {
        errors[key] = issue.message
      }
    })

    return { success: false, errors }
  }

  return {
    validateField,
    safeParse,
  }
}


function getSafeParseData(arg: HTMLFormElement | unknown): Record<string, any> {
  let data: Record<string, any> = {}

  if (arg instanceof HTMLFormElement) {
    const form = arg
    const formData = new FormData(form)

    const nameInfo = new Map<string, { hasCheckbox: boolean }>()
    for (const el of form.elements) {
      const input = el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

      if (input.name) {
        if (!nameInfo.has(input.name)) {
          nameInfo.set(input.name, { hasCheckbox: false })
        }

        if (input.type === 'checkbox') {
          nameInfo.get(input.name)!.hasCheckbox = true
        }
      }
    }

    for (const [name, info] of nameInfo) {
      const values = formData.getAll(name)

      if (info.hasCheckbox) {
        data[name] = values
      } else {
        data[name] = values.length > 0 ? values[0] : ''
      }
    }
  } else {
    data = arg as Record<string, any>
  }

  return data
}


/** What `createValidator()` provides */
export type Validator<T> = {
  validateField: (name: keyof T, value: unknown) => string | null,
  safeParse: (data: unknown) => { success: true; data: T } | { success: false; errors: Record<string, string> },
}


/** Extract the inferred type from a validator created by `createValidator`. */
export type InferValidator<T> = T extends Validator<infer U> ? U : never
