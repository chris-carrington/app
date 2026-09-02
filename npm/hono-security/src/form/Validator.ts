// app/npm/hono-security/src/form/Validator.ts

import * as v from 'valibot'
import type { FormUtil } from './FormUtil'

/**
 * A fully‑featured validator built from a Valibot object schema.
 * Provides client‑side field validation, full‑object validation, and access to the raw schema.
 *
 * @example
 * const validator = new Validator(
 *   v.object({
 *     email: v.pipe(v.string(), v.email()),
 *     password: v.pipe(v.string(), v.minLength(8)),
 *   })
 * )
 *
 * // Type inference
 * type FormData = typeof validator.data   // { email: string; password: string }
 *
 * // Methods
 * validator.schema            // the original Valibot schema
 * validator.validateField('email', 'test')   // returns error message or null
 * validator.safeParse(formElement)           // returns { success, data/errors }
 */
export class Validator<T extends v.ObjectSchema<any, any>> {
  readonly $typeFormUtil = undefined! as FormUtil<this['schema']>
  readonly $typeResult = undefined! as ReturnType<this['safeParse']>
  readonly $typeData = undefined! as v.InferOutput<T>

  #schema: T
  #defaultError: string

  constructor(schema: T, defaultError = 'Invalid value') {
    this.#schema = schema
    this.#defaultError = defaultError
  }

  /** The raw Valibot schema used to create this validator. */
  get schema(): T {
    return this.#schema
  }

  /**
   * Type‑only property for extracting the inferred output type.
   * @example typeof validator.data  // the validated object type
   */
  get data(): v.InferOutput<T> {
    return undefined as any // runtime value is never used
  }

  /**
   * Validates a single field against the schema.
   * @param name - Field name (key of the output type)
   * @param value - Value to validate
   * @returns Error message or `null` if valid
   */
  validateField<K extends keyof v.InferOutput<T>>(name: K, value: unknown): string | null {
    const fieldSchema = v.object({
      [name]: this.#schema.entries[name],
    })

    const result = v.safeParse(fieldSchema, { [name]: value })

    if (!result.success) {
      const issue = result.issues.find((i: any) => i.path?.[0]?.key === name)
      return issue?.message || this.#defaultError
    }

    return null
  }

  /**
   * Validates a full object (or form).
   * @param arg - An HTMLFormElement or plain object
   * @returns A discriminated union: `{ success: true; data: T }` or `{ success: false; errors: Record<string, string> }`
   */
  safeParse(
    arg: HTMLFormElement | unknown
  ): { success: true; data: v.InferOutput<T> } | { success: false; errors: Record<string, string> } {
    const data = getSafeParseData(arg)
    const result = v.safeParse(this.#schema, data)

    if (result.success) {
      return { success: true, data: result.output as v.InferOutput<T> }
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
}

/**
 * Helper to extract form data from an HTMLFormElement or use the raw object.
 */
function getSafeParseData(arg: HTMLFormElement | unknown): Record<string, any> {
  let data: Record<string, any> = {}

  if (arg instanceof HTMLFormElement) {
    const form = arg
    const formData = new FormData(form)

    // Track which fields have checkboxes (to handle multi‑value correctly)
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
