// app/hono-security/src/FormUtil.ts

import type { Validator } from './createValidator'


export class FormUtil<T_Validator> {
  #el: HTMLFormElement
  #validator: Validator<T_Validator>
  #domErrors: NodeListOf<HTMLDivElement>
  #domFields: NodeListOf<HTMLInputElement | HTMLTextAreaElement>

  constructor(el: HTMLFormElement, validator: Validator<T_Validator>) {
    this.#el = el
    this.#validator = validator
    this.#domErrors = el.querySelectorAll<HTMLDivElement>('div.error-message[data-field]')
    this.#domFields = el.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[name], textarea[name]')

    this.#bindEventListeners()
  }


  validateForm() {
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


  #resetErrors() {
    this.#displayErrors(({}))
  }


  #displayErrors(errors: Record<string, string>) {
    this.#domErrors.forEach((e) => (e.textContent = ''))
    this.#domFields.forEach((e) => e.classList.remove('has-error'))

    for (const [fieldName, errorMessage] of Object.entries(errors)) {
      if (errorMessage) {
        const errorEl = this.#el.querySelector<HTMLDivElement>(`div.error-message[data-field="${fieldName}"]`)
        if (errorEl) errorEl.textContent = errorMessage

        const input = this.#el.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${fieldName}"]`)
        if (input) input.classList.add('has-error')
      }
    }
  }


  #resetError(field: HTMLInputElement | HTMLTextAreaElement, name: keyof T_Validator) {
    const errorEl = this.#el.querySelector<HTMLDivElement>(`div.error-message[data-field="${String(name)}"]`)
    if (errorEl) errorEl.textContent = ''

    field.classList.remove('has-error')
    field.removeAttribute('aria-invalid')
  }


  #bindEventListeners() {
    this.#domFields.forEach((field) => {
      const name = field.name as keyof T_Validator
      if (!name) return

      field.addEventListener('blur', () => {
        const error = this.#validator.validateField(name, field.value)

        if (!error) this.#resetError(field, name)
        else {
          const errorEl = this.#el.querySelector<HTMLDivElement>(`div.error-message[data-field="${String(name) }"]`)
          if (errorEl) errorEl.textContent = error
          field.classList.add('has-error')
          field.setAttribute('aria-invalid', 'true')
        }
      })

      field.addEventListener('input', () => {
        if (!this.#validator.validateField(name, field.value)) this.#resetError(field, name)
      })
    })
  }
}
