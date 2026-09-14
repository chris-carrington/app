// app/npm/hono-form/src/form/FormUtil.ts

import * as v from 'valibot'
import type { Validator } from './Validator'
import type { ClientResponse, InferResponseType } from 'hono/client'


export class FormUtil<T_Schema extends v.ObjectSchema<any, any>> {
 readonly $typeInstance = undefined! as FormUtil<T_Schema>
 readonly $typeResult = undefined! as ReturnType<FormUtil<T_Schema>['validateForm']>
  readonly $typeData = undefined! as v.InferOutput<T_Schema>

  #el: HTMLFormElement
  #fileFields: HTMLInputElement[] = []
  #validator: Validator<T_Schema>
  #domErrors: NodeListOf<HTMLDivElement>
  #textFields: (HTMLInputElement | HTMLTextAreaElement)[] = []
  #selectFields: HTMLSelectElement[] = []
  #checkboxGroups: Map<string, HTMLInputElement[]> = new Map()


  constructor(el: HTMLFormElement, validator: Validator<T_Schema>) {
    this.#el = el
    this.#validator = validator
    this.#domErrors = el.querySelectorAll<HTMLDivElement>('div.error-message[data-field]')

    const allFields = el.querySelectorAll('input[name], textarea[name], select[name]')

    allFields.forEach((field) => {
      if ((field as HTMLElement).dataset.formUtilSkip) return

      if (field instanceof HTMLInputElement && field.type === 'checkbox') {
        const name = field.name

        if (name) {
          if (!this.#checkboxGroups.has(name)) this.#checkboxGroups.set(name, [])
          this.#checkboxGroups.get(name)!.push(field)
        }
      } else if (field instanceof HTMLInputElement && field.type === 'file') {
        this.#fileFields.push(field)
      } else if (field instanceof HTMLSelectElement) {
        this.#selectFields.push(field)
      } else if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
        this.#textFields.push(field)
      }
    })

    this.#bindTextListener()
    this.#bindSelectListener()
    this.#bindCheckboxListener()
    this.#bindFileListener()
  }

  validateForm(): { success: true; data: v.InferOutput<T_Schema> } | { success: false; errors: Record<string, string> } {
    const result = this.#validator.safeParse(this.#el)
    this.#resetErrors()

    if (!result.success) {
      this.#displayErrors(result.errors)
      const firstInvalid = this.#el.querySelector<HTMLDivElement>('.has-error')
      if (firstInvalid) firstInvalid.focus()
    }

    return result
  }


  resetForm() {
    this.#el.reset()
    this.#resetErrors()
  }


  /**
   * - Calls a Hono RPC api
   * - IF the `response` is not `ok` THEN we will throw an `Error` here and place the `res` (parsed json body) on the returned `Error.cause`
   * @param method the `rpc` method
   * @param args the `rpc` method's arguments
   * @returns `{ response, res }`: `response` is the `Response` and `res` is the parsed `json`
   */
  async rpc<T_Method extends (args: any) => Promise<ClientResponse<any>>>(method: T_Method, args: Parameters<T_Method>[0]): Promise<{ response: ClientResponse<any>, res: InferResponseType<T_Method> }> {
    const response = await method(args)
    const res = (await response.json()) as InferResponseType<T_Method>
    FormUtil.responseThrow(response, res)
    return { response, res }
  }


  /**
   * 1. Get the api response
   * 2. JSON parse the api response
   * 3. Pass both the `response` and the `res` (parsed json body) to `this.responseThrow()`
   * 4. IF the `response` is not `ok` THEN we will throw an Error here and place the `res` on the `Error.cause`
   * 5. @ `this.catch()` we will show valibot errors if they are found @ `Error.cause`
   * @example
    ```
    import { onError } from '@hono-api/fe'

    try {
      const response = await rpc.api.objective[':id'].$delete({ param: { id } })
      const res = await response.json()
      FormUtil.responseThrow(response, res)
      if (res.success) showToast({ variant: 'success', value: 'Success!' })
    } catch (e) {
      onError(e)
    }
    ```
   */
  static responseThrow(response: ClientResponse<any>, res: unknown) {
    if (!response.ok) {
      const error = new Error('Request failed'); // Throw an error with the full body so we can handle it in the catch
      error.cause = res // attach the parsed body
      throw error
    }
  }


  /**
   * @param error Error that is provided to `catch`
   * @param onError Helpful when we'd love to add additional logic to happen on error (then the standard valibot checks based on the api response)
   */
  catch(error: unknown, onError?: (error: unknown) => void): void {
    const res = v.safeParse(v.object({
      cause: v.object({
        success: v.literal(false),
        issues: v.pipe(
          v.array(v.unknown()),
          v.minLength(1)
        ),
      }),
    }), error)

    if (res.success) this.#beResponseValidate(res.output.cause)
    if (onError) onError(error)
  }


  #beResponseValidate(cause: { success: false, issues: any[] }) {
    const errors: Record<string, string> = {}

    for (const issue of cause.issues) {
      // Set fieldName (path > key)
      let fieldName: string | null = null

      if (issue.path && issue.path.length > 0) {
        const last = issue.path[issue.path.length - 1]

        if (last && 'key' in last) {
          fieldName = last.key as string;
        }
      }

      if (fieldName && issue.message) { // IF we found a field name AND there is a message THEN add it to the errors map
        if (!errors[fieldName]) { // keep first error
          errors[fieldName] = issue.message
        }
      }
    }

    this.#displayErrors(errors)
  }


  #resetErrors() {
    this.#displayErrors({})
  }


  #displayErrors(errors: Record<string, string>) {
    this.#domErrors.forEach((e) => {
      e.textContent = ''
      e.style.display = 'none'
    })

    this.#el.querySelectorAll('.has-error').forEach((e) => e.classList.remove('has-error'))
    this.#el.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'))

    for (const [fieldName, errorMessage] of Object.entries(errors)) {
      const errorEl = this.#el.querySelector<HTMLDivElement>(`div.error-message[data-field="${fieldName}"]`)

      if (errorEl) {
        errorEl.textContent = errorMessage ? errorMessage : ''
        errorEl.style.display = errorMessage ? 'block' : 'none'

        this.#el.querySelectorAll(`[name="${fieldName}"]`).forEach((input) => {
          input.classList[errorMessage ? 'add' : 'remove']('has-error')
        })
      }
    }
  }


  #clearFieldError(name: string) {
    const errorEl = this.#el.querySelector<HTMLDivElement>(`div.error-message[data-field="${name}"]`)

    if (errorEl) {
      errorEl.textContent = ''
      errorEl.style.display = 'none'
    }

    this.#el.querySelectorAll(`[name="${name}"]`).forEach((input) => {
      input.classList.remove('has-error')
      input.removeAttribute('aria-invalid')
    })
  }


  #bindTextListener() {
    for (const el of this.#textFields) {
      const name = el.name as keyof Validator<T_Schema>
      if (!name) continue

      el.addEventListener('blur', () => {
        const error = this.#validator.validateField(name, el.value)

        if (error) {
          const errorEl = this.#el.querySelector<HTMLDivElement>(`div.error-message[data-field="${String(name)}"]`)

          if (errorEl) {
            errorEl.textContent = error
            errorEl.style.display = 'block'
          }

          el.classList.add('has-error')
          el.setAttribute('aria-invalid', 'true')
        } else {
          this.#clearFieldError(String(name))
        }
      })

      el.addEventListener('input', () => {
        if (!this.#validator.validateField(name, el.value)) {
          this.#clearFieldError(String(name))
        }
      })
    }
  }


  #bindSelectListener() {
    for (const el of this.#selectFields) {
      const name = el.name as keyof Validator<T_Schema>
      if (!name) continue

      const validateSelect = () => {
        const error = this.#validator.validateField(name, el.value)
        if (error) {
          const errorEl = this.#el.querySelector<HTMLDivElement>(
            `div.error-message[data-field="${String(name)}"]`
          )
          if (errorEl) errorEl.textContent = error
          el.classList.add('has-error')
          el.setAttribute('aria-invalid', 'true')
        } else {
          this.#clearFieldError(String(name))
        }
      }

      el.addEventListener('blur', validateSelect)
      el.addEventListener('change', validateSelect)
    }
  }


  #bindCheckboxListener() {
    for (const [name, el] of this.#checkboxGroups) {
      for (const cb of el) {
        cb.addEventListener('change', () => {
          this.#validateCheckboxGroup(name)
        })
      }
    }
  }


  #validateCheckboxGroup(name: string) {
    const group = this.#checkboxGroups.get(name)
    if (!group) return

    const checkedValues = group.filter((cb) => cb.checked).map((cb) => cb.value)
    const errorMessage = this.#validator.validateField(name as keyof Validator<T_Schema>, checkedValues)

    if (!errorMessage) this.#clearFieldError(name)
    else {
      const errorEl = this.#el.querySelector<HTMLDivElement>(`div.error-message[data-field="${name}"]`)

      if (errorEl) {
        errorEl.textContent = errorMessage
        errorEl.style.display = 'block'
      }

      group.forEach((cb) => {
        cb.classList.add('has-error')
        cb.setAttribute('aria-invalid', 'true')
      })
    }
  }


  #bindFileListener() {
    for (const el of this.#fileFields) {
      const name = el.name as keyof Validator<T_Schema>
      if (!name) continue

      el.addEventListener('change', () => {
        this.#validateFile(el)
      })
    }
  }


  #validateFile(el: HTMLInputElement) {
    const name = el.name as keyof Validator<T_Schema>
    if (!name) return

    // Pass the File (or File[] for multiple) instead of the fakepath string.
    const value = el.multiple
      ? Array.from(el.files ?? [])
      : el.files?.[0]

    const error = this.#validator.validateField(name, value)

    if (error) {
      const errorEl = this.#el.querySelector<HTMLDivElement>(
        `div.error-message[data-field="${String(name)}"]`
      )
      if (errorEl) {
        errorEl.textContent = error
        errorEl.style.display = 'block'
      }
      el.classList.add('has-error')
      el.setAttribute('aria-invalid', 'true')
    } else {
      this.#clearFieldError(String(name))
    }
  }
}
