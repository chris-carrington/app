// app/src/auth/AuthModal.tsx

import { Style } from 'hono/css'
import type { FC } from 'hono/jsx'
import { urlBE } from '@src/url/urlBE'
import { modalStyle } from '@hono-modal'
import svgClose from '@src/svg/close.svg?raw'
import { onNavModalToggle } from '@hono-directives'


export default (() => {
  const url = urlBE()

  return <>
    <Style>{modalStyle}</Style>

    <div data-auth="undefined" id="auth-modal" class="modal-wrapper hidden">
      <button data-directive={onNavModalToggle('auth-modal')} class="backdrop" type="button" />

      <div class="modal">
        <div class="header">
          <span>Auth Options</span>
          <button
            class="close"
            type="button"
            dangerouslySetInnerHTML={{__html: svgClose}}
            data-directive={onNavModalToggle('auth-modal')} />
        </div>

        <div data-auth="loading" class="item lite">Loading...</div>
        <a data-auth="false" href={url['sign-in'].$url().href} class="item anchor">Sign In</a>
        <a data-auth="false" href={url['sign-up'].$url().href} class="item anchor">Sign Up</a>
        <a data-auth="true" href={url.profile.$url().href} class="item anchor">Profile</a>
        <a data-auth="true" href={url['sign-out'].$url().href} class="item anchor">Sign Out</a>
      </div>
    </div>
  </>
}) satisfies FC
