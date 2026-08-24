// app/src/nav/NavModal.tsx

import { Style } from 'hono/css'
import type { FC } from 'hono/jsx'
import { urlBE } from '@src/url/urlBE'
import { modalStyle } from '@hono-modal'
import svgClose from '@src/svg/close.svg?raw'
import { onNavModalToggle } from '@hono-directives'
import { datasetAuth, idNavModal } from '@src/lib/dom'


export default (() => {
  const url = urlBE()
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
          <a href={url['index'].$url().href} class="item anchor">Home</a>
          <a href={url['mastery'][':id?'].$url({ param: { id: '' } }).href} class="item anchor">Mastery</a>
          <a href={url['objectives'].$url().href} class="item anchor">Objectives</a>
          <a href={url['transparency'][':id?'].$url({ param: { id: '' } }).href} class="item anchor">Transparency</a>

          <div {...authDataset.attr('loading')} class="item title">Loading...</div>
          <a {...authDataset.attr('false')} href={url['sign-in'].$url().href} class="item anchor">Sign In</a>
          <a {...authDataset.attr('false')} href={url['sign-up'].$url().href} class="item anchor">Sign Up</a>
          <a {...authDataset.attr('true')} href={url.profile.$url().href} class="item anchor">Profile</a>
          <a {...authDataset.attr('true')} href={url['sign-out'].$url().href} class="item anchor">Sign Out</a>
        </div>
      </div>
    </div>
  </>
}) satisfies FC
