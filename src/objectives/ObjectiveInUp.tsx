// app/src/objectives/ObjectiveInUp.tsx

import { Field } from '@hono-form'
import type { FC } from 'hono/jsx'
import { css, Style } from 'hono/css'
import { mdStyle } from '@src/md/mdStyle'
import svgClose from '@src/svg/close.svg?raw'
import { kanbanColumns } from '@src/lib/vars'
import { onModalToggle, onMarkdownChecked } from '@hono-directives'
import { fieldObjectiveInUpColumnId, fieldObjectiveInUpTitle, fieldObjectiveInUpDescription, fieldObjectiveInUpAssigneeIds, fieldObjectiveInUpTagIds, idObjectiveInUpModal, idObjectiveInUpModalSubmit, idObjectiveInUpModalTitle, idObjectiveInUpModalMd, idObjectiveInUpModalMdToggle, idObjectiveInUpForm, idObjectiveInUpModalDelete, idObjectiveInUpModalCommentSpacer, idObjectiveInUpModalCommentForm, idObjectiveInUpModalComment, classNameName, classNameValue, classNameTemporal, idObjectiveInUpModalComments, classNameComment } from '@src/lib/dom'


export default (() => {
  const modalId = idObjectiveInUpModal().id
  const mdToggleId = idObjectiveInUpModalMdToggle().id

  return <>
    <Style>{style}</Style>
    <Style>{mdStyle}</Style>

    <div id={modalId} class="modal-wrapper modal-hidden">
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

        <div class="forms scroll">
          <form id={idObjectiveInUpForm().id} autocomplete="off" class="bg-white">
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

            <div id={idObjectiveInUpModalComments().id}>
              <div class="label">Comments</div>
            </div>

            <div id={idObjectiveInUpModalCommentSpacer().id}></div>

            <div class="buttons">
              <button id={idObjectiveInUpModalDelete().id} data-directive={onModalToggle('modal-confirm')} class="danger" type="button">Delete</button>
              <button id={idObjectiveInUpModalSubmit().id} class="primary" type="submit">Create Objective</button>
            </div>
          </form>

          <form id={idObjectiveInUpModalCommentForm().id} autocomplete="off" class="bg-white">
            <Field type="textarea" name="comment" prefix="objective-in-up" label="Comment" />
            <button class="blue" type="submit">Add Comment</button>
          </form>
        </div>
      </div>

      <template id={idObjectiveInUpModalComment().id}>
        <ObjectiveComment imageId="" name="" value="" temporal="" />
      </template>
    </div>
  </>
}) satisfies FC


const ObjectiveComment = (({ imageId, name, value, temporal }) => {
  return <>
    <div class={classNameComment().className}>
      <img src={`https://r2.shastatrades.org/${imageId}.webp`} alt="Assignee 1" />
      <div class="right">
        <div class={classNameName().className}>{name}</div>
        <div class={classNameValue().className}>{value}</div>
        <div class={classNameTemporal().className}>{temporal}</div>
      </div>
    </div>
  </>
}) satisfies FC<{ imageId: string, name: string, value: string, temporal: string }>


const style = css`
  #objective-in-up-modal {
    @media (min-height: 721px) {
      .modal {
        max-width: 96rem;          
      }
    }

    .forms {
      padding: var(--space-lite);

      form:last-child {
        position: relative;

        .field,
        button {
          position: absolute;
        }

        .field {
          bottom: 5.7rem;
        }

        button {
          bottom: 0;
        }
      }

      .field {
        margin-bottom: var(--space);
        &#fieldset--objective-in-up--tags .error-message {
          margin: 0;
        }
      }

      #fieldset--objective-in-up--tagIds {
        @media (max-width: 720px) {
          margin-top: var(--space);
        }

        label {
          font-size: 98%;
        }
      }

      #error-message--objective-in-up--comment {
        position: absolute;
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

          .md,
          textarea {
            height: 37.4rem;
            margin: 0;
            overflow: auto;
            width: 100%;
            max-width: none;
          }

          .md {
            display: none;
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
        }
      }

      #objective-in-up-modal-comment-spacer {
        height: 15rem;
      }

      #objective-in-up-modal-comments {
        margin-bottom: var(--space-lite);

        .comment {
          display: flex;
          gap: var(--space-lite);
          padding: var(--space-lite) 0;
          border-bottom: 1px solid #ced3d6;
          &:last-child {
            border-bottom: none;
          }

          img {
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            object-fit: cover;
            object-position: center center;
            box-shadow: 0 0 0 0.1rem #e2e8f0;
            background-color: #f1f5f9; /* fallback */
            margin-top: 0.6rem;
          }

          .temporal {
            opacity: 0.6;
            font-size: 90%;
          }
        }
      }

      .buttons {
        display: flex;
        align-items: center;
        gap: var(--space-lite);
        width: 100%;
        flex: 1;
        justify-content: end;
      }
    }
  }
`
