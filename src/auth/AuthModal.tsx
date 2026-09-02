// app/src/auth/AuthModal.tsx

import { Style } from 'hono/css'
import type { FC } from 'hono/jsx'
import { rpcBE } from '@hono-rpc/be'
import { modalStyle } from '@hono-modal'
import svgClose from '@src/svg/close.svg?raw'
import { onNavModalToggle } from '@hono-directives'
import { datasetAuth, idAuthModal } from '@src/lib/dom'


export default (() => {
  const rpc = rpcBE()
  const authDataset = datasetAuth()
  const authModalId = idAuthModal().id

  return <>
    <Style>{modalStyle}</Style>

    <div {...authDataset.attr('undefined')} id={authModalId} class="modal-wrapper hidden">
      <button data-directive={onNavModalToggle(authModalId)} class="backdrop" type="button" />

      <div class="modal">
        <div class="header">
          <span>Auth Options</span>
          <button
            class="close"
            type="button"
            dangerouslySetInnerHTML={{__html: svgClose}}
            data-directive={onNavModalToggle(authModalId)} />
        </div>

        <div {...authDataset.attr('loading')} class="item lite">Loading...</div>
        <a {...authDataset.attr('false')} href={rpc['sign-in'].$url().href} class="item anchor">Sign In</a>
        <a {...authDataset.attr('false')} href={rpc['sign-up'].$url().href} class="item anchor">Sign Up</a>
        <a {...authDataset.attr('true')} href={rpc.profile.$url().href} class="item anchor">Profile</a>
        <a {...authDataset.attr('true')} href={rpc['sign-out'].$url().href} class="item anchor">Sign Out</a>
      </div>
    </div>
  </>
}) satisfies FC
