// app/src/auth/AuthMenu.tsx

import { Style } from 'hono/css'
import type { FC } from 'hono/jsx'
import { urlBE } from '@src/url/urlBE'
import svgClose from '@src/svg/close.svg?raw'
import { menuStyle } from '@src/lib/menuStyle'
import { onNavMenuToggle } from '@hono-directives'


export default (() => {
  const url = urlBE()

  return <>
    <Style>{menuStyle}</Style>

    <div data-auth="undefined" id="auth-menu" class="menu hidden">
      <button data-directive={onNavMenuToggle('auth-menu')} class="backdrop" type="button" />

      <div class="items">
        <div class="item header">
          <span>Auth Menu</span>
          <button data-directive={onNavMenuToggle('auth-menu')} dangerouslySetInnerHTML={{__html: svgClose}} class="close" type="button" />
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
