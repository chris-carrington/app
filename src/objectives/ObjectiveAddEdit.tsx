// app/src/objectives/ObjectiveAddEdit.tsx


import type { FC } from 'hono/jsx'
import { css, Style } from 'hono/css'
import { Field } from '@hono-security'
import { modalStyle } from '@hono-modal'
import svgClose from '@src/svg/close.svg?raw'
import { kanbanColumns } from '@src/lib/vars'
import { onModalToggle } from '@hono-directives'


export default (() => {
  return <>
    <Style>{style}</Style>
    <Style>{modalStyle}</Style>

    <div id="objective-add-edit-modal" class="modal-wrapper hidden">
      <button data-directive={onModalToggle('objective-add-edit-modal')} class="backdrop" type="button" />

      <div class="modal">
        <div class="header">
          <span>Create Objective</span>
          <button
            class="close"
            type="button"
            dangerouslySetInnerHTML={{__html: svgClose}}
            data-directive={onModalToggle('objective-add-edit-modal')} />
        </div>

        <form id="objective-add-edit-form" autocomplete="off" class="scroll bg-white">

          <Field name="title" label="Title" placeholder="Please add a descriptive title..." type="text" prefix="objective-add-edit" />

          <Field name="column" label="Column" type="select" options={kanbanColumns.map(c => ({value: String(c.id), label: c.value}))} prefix="objective-add-edit" />

          <button class="primary wide" type="submit">Create Objective</button>
        </form>
      </div>
    </div>
  </>
}) satisfies FC


const style = css`
  #objective-add-edit-modal {
    form {
      padding: var(--space-lite);
    }
  }
`
