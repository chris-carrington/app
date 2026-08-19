// app/src/auth/AuthMenu.tsx

import { Style } from 'hono/css'
import type { FC } from 'hono/jsx'
import { createUrl } from '@src/lib/createUrl'
import { menuStyle } from '@src/lib/menuStyle'
import { onNavMenuToggle } from '@hono-directives'


export default (() => {
  const url = createUrl()

  return <>
    <Style>{menuStyle}</Style>

    <div data-auth="undefined" id="auth-menu" class="menu hidden">
      <button data-directive={onNavMenuToggle('auth-menu')} class="backdrop" type="button" />

      <div class="items">
        <div class="item title">Auth Menu</div>
        <div data-auth="loading" class="item title">Loading...</div>
        <a data-auth="false" href={url['sign-in'].$url().href} class="item anchor">Sign In</a>
        <a data-auth="false" href={url['sign-up'].$url().href} class="item anchor">Sign Up</a>
        <a data-auth="true" href={url['index'].$url().href} class="item anchor">Profile</a>
        <a data-auth="true" href={url['index'].$url().href} class="item anchor">Sign Out</a>
        <button data-directive={onNavMenuToggle('auth-menu')} class="item btn" type="button">Close Auth Menu</button>
      </div>
    </div>
  </>
}) satisfies FC
