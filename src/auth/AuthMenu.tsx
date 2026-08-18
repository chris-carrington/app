// app/src/auth/AuthMenu.tsx

import { Style } from 'hono/css'
import type { FC } from 'hono/jsx'
import { menuStyle } from '@src/lib/menuStyle'
import { onNavMenuToggle } from '@hono-directives'


export default (() => {
  return <>
    <Style>{menuStyle}</Style>

    <div data-auth="undefined" id="auth-menu" class="menu hidden">
      <button data-directive={onNavMenuToggle('auth-menu')} class="backdrop" type="button" />

      <div class="items">
        <div class="item title">Auth Menu</div>
        <div data-auth="loading" class="item title">Loading...</div>
        <a data-auth="false" href="/sign-in" class="item anchor">Sign In</a>
        <a data-auth="false" href="/sign-up" class="item anchor">Sign Up</a>
        <a data-auth="true" href="/sign-up" class="item anchor">Profile</a>
        <a data-auth="true" href="/sign-out" class="item anchor">Sign Out</a>
        <button data-directive={onNavMenuToggle('auth-menu')} class="item btn" type="button">Close Auth Menu</button>
      </div>
    </div>
  </>
}) satisfies FC
