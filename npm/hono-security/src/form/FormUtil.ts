// app/npm/hono-security/src/form/FormUtil.ts

import type { Validator } from './Validator'
import type { ObjectSchema, InferOutput } from 'valibot'
import type { ClientResponse, InferResponseType } from 'hono/client'


export class FormUtil<T_Schema extends ObjectSchema<any, any>> {
 readonly $typeInstance = undefined! as FormUtil<T_Schema>
 readonly $typeResult = undefined! as ReturnType<FormUtil<T_Schema>['validateForm']>
 readonly $typeData = undefined! as InferOutput<T_Schema>

  #el: HTMLFormElement
  #validator: Validator<T_Schema>
  #domErrors: NodeListOf<HTMLDivElement>
  #textFields: (HTMLInputElement | HTMLTextAreaElement)[]
  #selectFields: HTMLSelectElement[]
  #checkboxGroups: Map<string, HTMLInputElement[]>


  constructor(el: HTMLFormElement, validator: Validator<T_Schema>) {
    this.#el = el
    this.#validator = validator
    this.#domErrors = el.querySelectorAll<HTMLDivElement>('div.error-message[data-field]')

    const allFields = el.querySelectorAll('input[name], textarea[name], select[name]')
    const textFields: (HTMLInputElement | HTMLTextAreaElement)[] = []
    const selectFields: HTMLSelectElement[] = []
    const checkboxGroups = new Map<string, HTMLInputElement[]>()

    allFields.forEach((field) => {
      if (field instanceof HTMLInputElement && field.dataset.formUtilSkip) return

      if (field instanceof HTMLInputElement && field.type === 'checkbox') {
        const name = field.name

        if (name) {
          if (!checkboxGroups.has(name)) checkboxGroups.set(name, [])
          checkboxGroups.get(name)!.push(field)
        }
      } else if (field instanceof HTMLSelectElement) {
        selectFields.push(field)
      } else if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
        textFields.push(field)
      }
    })

    this.#textFields = textFields
    this.#selectFields = selectFields
    this.#checkboxGroups = checkboxGroups

    this.#bindEventListeners()
  }

  validateForm(): { success: true; data: InferOutput<T_Schema> } | { success: false; errors: Record<string, string> } {
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
   * @param onNotDisplayingValibotErrors Called anytime we do not show valibot errors
   */
  catch(error: unknown, onNotDisplayingValibotErrors: (error: unknown) => void): void {
    if (!(error instanceof Error)) onNotDisplayingValibotErrors(error)
    else if (!error.cause) onNotDisplayingValibotErrors(error)
    else if (typeof error.cause !== 'object') onNotDisplayingValibotErrors(error)
    else if (!('success' in error.cause)) onNotDisplayingValibotErrors(error)
    else if (error.cause.success !== false) onNotDisplayingValibotErrors(error)
    else this.#beResponseValidate(error.cause)
  }


  #beResponseValidate(res: unknown): { noIssues: boolean } {
    if (typeof res !== 'object') return { noIssues: true }
    if (!res) return { noIssues: false }
    if (!('success' in res)) return { noIssues: false }
    if (!('issues' in res)) return { noIssues: false }
    if (!Array.isArray(res.issues)) return { noIssues: true }
    if (!res.issues.length) return { noIssues: true }

    const errors: Record<string, string> = {}

    for (const issue of res.issues) {
      // Set fieldName (path > key)
      let fieldName: string | null = null

      if (issue.path && issue.path.length > 0) {
        const last = issue.path[issue.path.length - 1]

        if (last && 'key' in last) {
          fieldName = last.key as string;
        }
      }

      // If we found a field name and there is a message, add it to the errors map
      if (fieldName && issue.message) {
        if (!errors[fieldName]) { // keep first error
          errors[fieldName] = issue.message
        }
      }
    }

    this.#displayErrors(errors)
    return { noIssues: false }
  }


  #resetErrors() {
    this.#displayErrors({})
  }


  #displayErrors(errors: Record<string, string>) {
    // Clear all error messages and remove 'has-error' class from all fields
    this.#domErrors.forEach((e) => (e.textContent = ''))
    this.#el.querySelectorAll('.has-error').forEach((e) => e.classList.remove('has-error'))

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


  #validateCheckboxGroup(name: string) {
    const group = this.#checkboxGroups.get(name)
    if (!group) return

    const checkedValues = group.filter((cb) => cb.checked).map((cb) => cb.value)
    const errorMessage = this.#validator.validateField(name as keyof Validator<T_Schema>, checkedValues)

    if (errorMessage) {
      const errorEl = this.#el.querySelector<HTMLDivElement>(`div.error-message[data-field="${name}"]`)

      if (errorEl) {
        errorEl.textContent = errorMessage
        errorEl.style.display = 'block'
      }

      group.forEach((cb) => {
        cb.classList.add('has-error')
        cb.setAttribute('aria-invalid', 'true')
      })
    } else {
      this.#clearFieldError(name)
    }
  }


  #bindEventListeners() {
    // --- Text / textarea / email fields ---
    this.#textFields.forEach((field) => {
      const name = field.name as keyof Validator<T_Schema>
      if (!name) return

      field.addEventListener('blur', () => {
        const error = this.#validator.validateField(name, field.value)

        if (error) {
          const errorEl = this.#el.querySelector<HTMLDivElement>(`div.error-message[data-field="${String(name)}"]`)

          if (errorEl) {
            errorEl.textContent = error
            errorEl.style.display = 'block'
          }

          field.classList.add('has-error')
          field.setAttribute('aria-invalid', 'true')
        } else {
          this.#clearFieldError(String(name))
        }
      })

      field.addEventListener('input', () => {
        if (!this.#validator.validateField(name, field.value)) {
          this.#clearFieldError(String(name))
        }
      })
    })

    // --- Select dropdowns ---
    this.#selectFields.forEach((field) => {
      const name = field.name as keyof Validator<T_Schema>
      if (!name) return

      const validateSelect = () => {
        const error = this.#validator.validateField(name, field.value)
        if (error) {
          const errorEl = this.#el.querySelector<HTMLDivElement>(
            `div.error-message[data-field="${String(name)}"]`
          )
          if (errorEl) errorEl.textContent = error
          field.classList.add('has-error')
          field.setAttribute('aria-invalid', 'true')
        } else {
          this.#clearFieldError(String(name))
        }
      }

      field.addEventListener('blur', validateSelect)
      field.addEventListener('change', validateSelect)
    })

    // --- Checkbox groups ---
    for (const [name, checkboxes] of this.#checkboxGroups) {
      checkboxes.forEach((cb) => {
        cb.addEventListener('change', () => {
          this.#validateCheckboxGroup(name)
        })
      })
    }
  }
}
