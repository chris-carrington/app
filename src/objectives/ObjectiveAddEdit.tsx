// app/src/objectives/ObjectiveAddEdit.tsx


import type { FC } from 'hono/jsx'
import { css, Style } from 'hono/css'
import { Field } from '@hono-security'
import { modalStyle } from '@hono-modal'
import svgClose from '@src/svg/close.svg?raw'
import { kanbanColumns } from '@src/lib/vars'
import { onModalToggle } from '@hono-directives'
import { fieldObjectiveAddEditColumn, fieldObjectiveAddEditTitle, idObjectiveAddEditModal, idObjectiveAddEditModalSubmit, idObjectiveAddEditModalTitle } from '@src/lib/dom'


export default (() => {
  const modalId = idObjectiveAddEditModal().id

  return <>
    <Style>{style}</Style>
    <Style>{modalStyle}</Style>

    <div id={modalId} class="modal-wrapper hidden">
      <button data-directive={onModalToggle(modalId)} class="backdrop" type="button" />

      <div class="modal">
        <div class="header">
          <span id={idObjectiveAddEditModalTitle().id}>Create Objective</span>
          <button
            class="close"
            type="button"
            dangerouslySetInnerHTML={{__html: svgClose}}
            data-directive={onModalToggle(modalId)} />
        </div>

        <form id="objective-add-edit-form" autocomplete="off" class="scroll bg-white">

          <Field {...fieldObjectiveAddEditTitle().attr()} label="Title" placeholder="Please add a descriptive title..." />

          <Field {...fieldObjectiveAddEditColumn().attr()} label="Column" options={kanbanColumns.map(c => ({ value: String(c.id), label: c.value }))} />

          <button id={idObjectiveAddEditModalSubmit().id} class="primary wide" type="submit">Create Objective</button>
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
