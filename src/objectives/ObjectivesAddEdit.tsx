// app/src/objectives/ObjectivesAddEdit.tsx


import type { FC } from 'hono/jsx'
import { css, Style } from 'hono/css'
import { modalStyle } from '@hono-modal'
import svgClose from '@src/svg/close.svg?raw'
import { onModalToggle } from '@hono-directives'
import { Column } from '@src/objectives/objectives.types'


export default (({ COLUMNS }: { COLUMNS: Column[] }) => {
  return <>
    <Style>{style}</Style>
    <Style>{modalStyle}</Style>

    <div id="objectives-add-edit-modal" class="modal-wrapper hidden">
      <button data-directive={onModalToggle('objectives-add-edit-modal')} class="backdrop" type="button" />

      <div class="modal">
        <div class="header">
          <span>Create Objective</span>
          <button
            class="close"
            type="button"
            dangerouslySetInnerHTML={{__html: svgClose}}
            data-directive={onModalToggle('objectives-add-edit-modal')} />
        </div>

        <form id="addTaskForm" autocomplete="off" class="scroll">
          <div class="field">
            <label for="objectiveTitleInput">Title</label>
            <input type="text" id="objectiveTitleInput" name="objectiveTitleInput"
              placeholder="Add a descriptive title..." required />
          </div>

          <div class="field">
            <label for="objectiveColumnSelect">Column</label>
            <select id="objectiveColumnSelect" name="objectiveColumnSelect" required>
              {COLUMNS.map((column, idx) => (
                <option value={column.id} selected={idx === 0}>
                  {column.value}
                </option>
              ))}
            </select>
          </div>

          <button class="form-submit-button" type="submit">Create Objective</button>
        </form>
      </div>
    </div>
  </>
}) satisfies FC<{ COLUMNS: Column[] }>


const style = css`
  #objectives-add-edit-modal {
    form {
      padding: var(--space-lite);
      display: flex;
      flex-direction: column;
      gap: var(--space-lite);
      width: 100%;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: calc(var(--space-lite) / 2);

      label {
        font-size: 1.8rem;
        font-weight: 500;
        color: #475569;
      }

      input,
      select {
        font-size: 1.8rem;
        font-weight: 400;
        color: #1e293b;
        background-color: #f8fafc;
        border: 0.2rem solid #e2e8f0;
        border-radius: var(--radius);
        padding: 1.2rem 1.6rem;
        outline: none;
        transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
        font-family: inherit;
        width: 100%;
        &:focus {
          outline: 0;
          border-color: transparent;
          box-shadow: 0 0 0 0.3rem rgba(0, 123, 255, 0.25);
        }
      }

      select {
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='10' viewBox='0 0 16 10'%3E%3Cpath d='M1 1l7 7 7-7' stroke='%23475569' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 1.6rem center;
        padding-right: 4.4rem;
      }
    }

    button[type="submit"] {
      width: 100%;
      font-weight: 600;
      color: var(--white);
      background: var(--primary-gradient);
      border: none;
      border-radius: var(--radius);
      padding: var(--space-lite);
      margin-top: var(--space-lite);
      cursor: pointer;
      transition: box-shadow 0.25s ease, transform 0.2s ease, opacity 0.2s ease;
      &:hover {
        box-shadow: 0 0.6rem 2rem rgba(99, 102, 241, 0.35);
        transform: translateY(-0.2rem);
      }
      &:active {
        transform: translateY(0);
        box-shadow: 0 0.2rem 0.8rem rgba(99, 102, 241, 0.25);
        opacity: 0.85;
      }
    }
  }
`
