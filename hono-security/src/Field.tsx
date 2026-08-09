// app/hono-security/src/Field.tsx

import type { FC } from 'hono/jsx'


export const Field: FC<FieldProps> = (props: FieldProps) => {
  let field = <></>

  const fieldID = props.type +'--'+ props.prefix + '--' + props.name
  const errorID = 'error-message--' + props.prefix + '--' + props.name

  switch(props.type) {
    case 'text':
    case 'email':
      field = <input
        type={props.type}
        id={fieldID}
        name={props.name}
        placeholder={props.placeholder ?? ''}
        aria-describedby={errorID}
        aria-required={props.required ? "true" : undefined} />
      break
    case 'textarea':
      field = <textarea
        id={fieldID}
        name={props.name}
        placeholder={props.placeholder ?? ''}
        aria-describedby={errorID}
        aria-required={props.required ? "true" : undefined} />
      break
    case 'select':
      field = <>
        <select
          id={fieldID}
          name={props.name}
          aria-describedby={errorID}
          aria-required={props.required ? "true" : undefined}
        >
          { props.placeholder && <option value="">{props.placeholder}</option> }
          { props.options.map(item => <option value={item.value}>{item.label}</option>) }
        </select>
      </>
      break
  }

  return <>
    <div class="field">
      <label for={fieldID}>{props.label ?? props.placeholder}</label>
      {field}
      <div id={errorID} data-field={props.name} role="alert" aria-live="polite" class="error-message" />
    </div>
  </>
}


export type FieldProps = 
  | FieldPropsSelect
  | FieldPropsBase & { type: 'text' | 'email' | 'textarea' } 


type FieldPropsBase = {
  prefix: string,
  name: string,
  required?: boolean,
  placeholder?: string,
  label?: string,
}


type FieldPropsSelect = FieldPropsBase & {
  type: 'select',
  options: {
    value: string,
    label: string
  }[]
}
