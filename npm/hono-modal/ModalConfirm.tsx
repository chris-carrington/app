// app/npm/hono-modal/ModalConfirm.tsx

import { Style } from 'hono/css'
import type { FC } from 'hono/jsx'
import { modalStyle } from './modalStyle'
import svgClose from '@src/svg/close.svg?raw'
import { onModalToggle, onConfirmSubmit } from '@hono-directives'


/**
 * @param message Confirm modal message
 * @param title Optional, default is `Please Confirm`, Confirm modal title
 */
export const ModalConfirm = (({ message, title }) => {
  return <>
    <Style>{modalStyle}</Style>

    <div id="modal-confirm" class="modal-wrapper hidden">
      <button data-directive={onModalToggle('modal-confirm')} class="backdrop" type="button" />

      <div class="modal">
        <div class="header">
          <span>{ title ?? 'Please Confirm' }</span>
          <button
            class="close"
            type="button"
            dangerouslySetInnerHTML={{ __html: svgClose }}
            data-directive={onModalToggle('modal-confirm')} />
        </div>

        <form data-directive={onConfirmSubmit()} autocomplete="off" class="bg-white">
          <div class="message">{message}</div>

          <div class="buttons">
            <button data-directive={onModalToggle('modal-confirm')} type="button">Cancel</button>
            <button type="submit">OK</button>
          </div>
        </form>
      </div>
    </div>
  </>
}) satisfies FC<{ message: string, title?: string }>
