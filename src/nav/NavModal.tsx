// app/src/nav/NavModal.tsx

import { Style } from 'hono/css'
import type { FC } from 'hono/jsx'
import { rpcBE } from '@hono-rpc/be'
import { modalStyle } from '@hono-modal'
import type { AppType } from '@src/index'
import svgClose from '@src/svg/close.svg?raw'
import { onNavModalToggle } from '@hono-directives'
import { datasetAuth, idNavModal } from '@src/lib/dom'


export default (() => {
  const rpc = rpcBE<AppType>()
  const authDataset = datasetAuth()
  const navModalId = idNavModal().id

  return <>
    <Style>{modalStyle}</Style>

    <div {...authDataset.attr('undefined')} id={navModalId} class="modal-wrapper hidden">
      <button data-directive={onNavModalToggle(navModalId)} class="backdrop" type="button" />

      <div class="modal">
        <div class="header">
          <span>Navigation</span>
          <button
            class="close"
            type="button"
            data-directive={onNavModalToggle(navModalId)}
            dangerouslySetInnerHTML={{ __html: svgClose }} />
        </div>

        <div class="scroll">
          <a href={rpc['index'].$url().href} class="item anchor">Home</a>
          <a href={rpc['mastery'][':id?'].$url({ param: { id: '' } }).href} class="item anchor">Mastery</a>
          <a href={rpc['objectives'].$url().href} class="item anchor">Objectives</a>
          <a href={rpc['transparency'][':id?'].$url({ param: { id: '' } }).href} class="item anchor">Transparency</a>

          <div {...authDataset.attr('loading')} class="item title">Loading...</div>
          <a {...authDataset.attr('false')} href={rpc['sign-in'].$url().href} class="item anchor">Sign In</a>
          <a {...authDataset.attr('false')} href={rpc['sign-up'].$url().href} class="item anchor">Sign Up</a>
          <a {...authDataset.attr('true')} href={rpc.profile.$url().href} class="item anchor">Profile</a>
          <a {...authDataset.attr('true')} href={rpc['sign-out'].$url().href} class="item anchor">Sign Out</a>
        </div>
      </div>
    </div>
  </>
}) satisfies FC
