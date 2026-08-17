// app/npm/hono-security/src/form/FormUtil.ts

import type { Validator } from './createValidator'

export class FormUtil<T_Validator> {
  #el: HTMLFormElement
  #validator: Validator<T_Validator>
  #domErrors: NodeListOf<HTMLDivElement>
  #textFields: (HTMLInputElement | HTMLTextAreaElement)[]
  #selectFields: HTMLSelectElement[]
  #checkboxGroups: Map<string, HTMLInputElement[]>

  constructor(el: HTMLFormElement, validator: Validator<T_Validator>) {
    this.#el = el
    this.#validator = validator
    this.#domErrors = el.querySelectorAll<HTMLDivElement>('div.error-message[data-field]')

    const allFields = el.querySelectorAll('input[name], textarea[name], select[name]')
    const textFields: (HTMLInputElement | HTMLTextAreaElement)[] = []
    const selectFields: HTMLSelectElement[] = []
    const checkboxGroups = new Map<string, HTMLInputElement[]>()

    allFields.forEach((field) => {
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
    this.#displayErrors({})
  }

  #displayErrors(errors: Record<string, string>) {
    // Clear all error messages and remove 'has-error' class from all fields
    this.#domErrors.forEach((e) => (e.textContent = ''))
    this.#el.querySelectorAll('.has-error').forEach((e) => e.classList.remove('has-error'))

    for (const [fieldName, errorMessage] of Object.entries(errors)) {
      if (errorMessage) {
        const errorEl = this.#el.querySelector<HTMLDivElement>(
          `div.error-message[data-field="${fieldName}"]`
        )
        if (errorEl) errorEl.textContent = errorMessage

        // No generic – works on any Element
        const inputs = this.#el.querySelectorAll(`[name="${fieldName}"]`)
        inputs.forEach((input) => input.classList.add('has-error'))
      }
    }
  }

  #clearFieldError(name: string) {
    const errorEl = this.#el.querySelector<HTMLDivElement>(
      `div.error-message[data-field="${name}"]`
    )
    if (errorEl) errorEl.textContent = ''

    const inputs = this.#el.querySelectorAll(`[name="${name}"]`)
    inputs.forEach((input) => {
      input.classList.remove('has-error')
      input.removeAttribute('aria-invalid')
    })
  }

  #validateCheckboxGroup(name: string) {
    const group = this.#checkboxGroups.get(name)
    if (!group) return

    const checkedValues = group.filter((cb) => cb.checked).map((cb) => cb.value)
    const error = this.#validator.validateField(name as keyof T_Validator, checkedValues)

    if (error) {
      const errorEl = this.#el.querySelector<HTMLDivElement>(
        `div.error-message[data-field="${name}"]`
      )
      if (errorEl) errorEl.textContent = error
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
      const name = field.name as keyof T_Validator
      if (!name) return

      field.addEventListener('blur', () => {
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
      })

      field.addEventListener('input', () => {
        if (!this.#validator.validateField(name, field.value)) {
          this.#clearFieldError(String(name))
        }
      })
    })

    // --- Select dropdowns ---
    this.#selectFields.forEach((field) => {
      const name = field.name as keyof T_Validator
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