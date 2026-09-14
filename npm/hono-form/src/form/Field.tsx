// app/npm/hono-form/src/Field.tsx

import type { FC } from 'hono/jsx'


export const Field: FC<FieldProps> = (props: FieldProps) => {
  let field = <></>

  const fieldID = props.type + '--' + props.prefix + '--' + props.name
  const errorID = 'error-message--' + props.prefix + '--' + props.name

  const errorElement = <div id={errorID} data-field={props.name} role="status" aria-live="polite" class="error-message" />

  switch (props.type) {
    case 'text':
    case 'file':
    case 'email':
    case 'number':
    case 'password':
      field = <input
        type={props.type}
        id={fieldID}
        name={props.name}
        value={props.type === 'file' ? '' : (props.value ?? '')}
        placeholder={props.type === 'file' ? '' : (props.placeholder ?? '')}
        aria-describedby={errorID}
        aria-required={props.required ? "true" : undefined} />
      break
    case 'textarea':
      field = <>
        <textarea
          id={fieldID}
          name={props.name}
          placeholder={props.placeholder ?? ''}
          aria-describedby={errorID}
          aria-required={props.required ? "true" : undefined}
        >{props.value ?? ''}</textarea>
      </>
      break
    case 'select':
      field = <>
        <select
          id={fieldID}
          name={props.name}
          aria-describedby={errorID}
          aria-required={props.required ? "true" : undefined}
        >
          {
            props.placeholder && <>
              <option value="" selected={props.value === '' ? true : undefined}>{props.placeholder}</option>
            </>
          }
          {
            props.options.map(item => <>
              <option value={item.value} selected={props.value === item.value ? true : undefined}>
                {item.label}
              </option>
            </>)
          }
        </select>
      </>
      break
    case 'checkbox': {
      const fieldsetID = 'fieldset--' + props.prefix + '--' + props.name
      const checkedValues = new Set<string>(
        Array.isArray(props.value)
          ? props.value
          : props.value !== undefined
            ? [props.value]
            : []
      )

      const checkboxes = props.options.map(item => {
        const id = fieldID + '--' + item.value

        return <>
          <div class="checkbox">
            <input
              type="checkbox"
              id={id}
              name={props.name}
              value={item.value}
              checked={checkedValues.has(item.value)} />
            <label for={id}>{item.label}</label>
          </div>
        </>
      })

      return <>
        <fieldset id={fieldsetID} aria-describedby={errorID} class="field checkboxes">
          <legend>{props.label ?? props.placeholder}</legend>
          {checkboxes}
          {errorElement}
        </fieldset>
      </>
    }
  }

  return <>
    <div class="field">
      <label for={fieldID}>{props.label ?? props.placeholder}</label>
      {field}
      {errorElement}
    </div>
  </>
}


export type FieldOption = {
  value: string,
  label: string,
}

export type FieldProps =
  | FieldPropsSelect
  | FieldPropsCheckbox
  | FieldPropsSimple


type FieldPropsBase = {
  prefix: string,
  name: string,
  required?: boolean,
  placeholder?: string,
  label?: string,
}


type FieldPropsValue = {
  value?: string,
}


type FieldPropsSimple = FieldPropsBase & FieldPropsValue & {
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'file'
}


type FieldPropsSelect = FieldPropsBase & FieldPropsValue & {
  type: 'select',
  options: FieldOption[]
}


type FieldPropsCheckbox = FieldPropsBase & {
  type: 'checkbox',
  value?: string | string[],
  options: FieldOption[]
}
