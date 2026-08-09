// app/hono-security/createValidator.ts

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

  /**
   * Validate a single field (for live client feedback).
   */
  function validateField<K extends keyof Output>(name: K, value: string): string | null {
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
  function safeParse(arg: HTMLFormElement | unknown): { success: true; data: Output } | { success: false; errors: Record<string, string> } {
    const data = arg instanceof HTMLFormElement
      ? Object.fromEntries((new FormData(arg).entries()))
      : arg

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


/** What `createValidator()` provides */
export type Validator<T> = {
  validateField: (name: keyof T, value: string) => string | null;
  safeParse: (data: unknown) => { success: true; data: T } | { success: false; errors: Record<string, string> };
}


/** Extract the inferred type from a validator created by `createValidator`. */
export type InferValidator<T> = T extends Validator<infer U> ? U : never;
