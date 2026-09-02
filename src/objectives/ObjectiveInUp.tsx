// app/src/objectives/ObjectiveInUp.tsx


import type { FC } from 'hono/jsx'
import { css, Style } from 'hono/css'
import { Field } from '@hono-security'
import { modalStyle } from '@hono-modal'
import { mdStyle } from '@src/md/mdStyle'
import svgClose from '@src/svg/close.svg?raw'
import { kanbanColumns } from '@src/lib/vars'
import { onModalToggle, onMarkdownChecked } from '@hono-directives'
import { fieldObjectiveInUpColumnId, fieldObjectiveInUpTitle, fieldObjectiveInUpDescription, fieldObjectiveInUpAssigneeIds, fieldObjectiveInUpTagIds, idObjectiveInUpModal, idObjectiveInUpModalSubmit, idObjectiveInUpModalTitle, idObjectiveInUpModalMd, idObjectiveInUpModalMdToggle, idObjectiveInUpForm } from '@src/lib/dom'


export default (() => {
  const modalId = idObjectiveInUpModal().id
  const mdToggleId = idObjectiveInUpModalMdToggle().id

  return <>
    <Style>{style}</Style>
    <Style>{mdStyle}</Style>
    <Style>{modalStyle}</Style>

    <div id={modalId} class="modal-wrapper hidden">
      <button data-directive={onModalToggle(modalId)} class="backdrop" type="button" />

      <div class="modal">
        <div class="header">
          <span id={idObjectiveInUpModalTitle().id}>Create Objective</span>
          <button
            class="close"
            type="button"
            dangerouslySetInnerHTML={{__html: svgClose}}
            data-directive={onModalToggle(modalId)} />
        </div>

        <form id={idObjectiveInUpForm().id} autocomplete="off" class="scroll bg-white">
          <div class="columns">
            <div class="left">
              <Field {...fieldObjectiveInUpTitle().attr()} label="Title" />
              <Field {...fieldObjectiveInUpColumnId().attr()} label="Column" options={kanbanColumns.map(c => ({ value: String(c.id), label: c.value }))} />
              <Field {...fieldObjectiveInUpAssigneeIds().attr()} label="Assignees" options={[]} />
            </div>
            <div class="right">

              <div class="checkbox">
                <input data-directive={onMarkdownChecked()} data-form-util-skip="true" id={mdToggleId} type="checkbox" />
                <label for={mdToggleId}>Markdown</label>
              </div>

              <Field {...fieldObjectiveInUpDescription().attr()} label="Description" />
              <div id={idObjectiveInUpModalMd().id} class="md"></div>
            </div>
          </div>

          <Field {...fieldObjectiveInUpTagIds().attr()} label="Tags" options={[]} />

          <button id={idObjectiveInUpModalSubmit().id} class="primary wide" type="submit">Create Objective</button>
        </form>
      </div>
    </div>
  </>
}) satisfies FC


const style = css`
  #objective-in-up-modal {
    @media (min-height: 721px) {
      .modal {
        max-width: 96rem;          
      }
    }

    form {
      padding: var(--space-lite);

      .field {
        margin-bottom: var(--space);
        &#fieldset--objective-in-up--tags .error-message {
          margin: 0;
        }
      }

      .md,
      textarea {
        height: 37.4rem;
        margin: 0;
        overflow: auto;
        width: 100%;
        max-width: none;
      }

      .md {
        padding: var(--space-lite);
        border: 1px solid transparent;

        code {
          font-size: 1.53rem;
          background: rgba(86, 89, 87, 0.1);
          padding: 0.3rem 0.45rem;
          border-radius: var(--radius);
          border: 1px solid rgba(6, 27, 14, 0.1);
          display: inline;
        }

        ul {
          padding-inline-start: var(--space-lite);
        }
      }

      .columns {
        display: flex;
        gap: var(--space-lite);

        @media (max-width: 720px) {
          flex-direction: column;
          gap: 0;
        }

        .left {
          width: 36rem;
          max-width: 36rem;

          @media (max-width: 720px) {
            width: 100%;
            max-width: 100%;
          }
        }

        .right {
          flex: 1;
          position: relative;

          .field {
            margin-bottom: 0;

            @media (max-width: 720px) {
              margin-bottom: var(--space);
            }
          }

          .checkbox {
            position: absolute;
            right: 0;
            top: 0.3rem;
            display: flex;
            align-items: center;
            cursor: pointer;
            opacity: 0.81;
            transition: var(--transition);
            &:hover {
              opacity: 1;
            }

            input,
            label {
              cursor: pointer;
            }

            label {
              font-size: 1.8rem;
              user-select: none;
            }

            input {
              margin: 0 calc(var(--space-lite) / 2) 0 0;
              width: 1.8rem;
              height: 1.8rem;
            }
          }
        }
      }
    }
  }
`
