// app/src/nav/NavMenu.tsx

import { Style } from 'hono/css'
import type { FC } from 'hono/jsx'
import { menuStyle } from '@src/lib/menuStyle'
import { onNavMenuToggle } from '@hono-directives'


export default (() => {
  return <>
    <Style>{menuStyle}</Style>

    <div data-auth="undefined" id="nav-menu" class="menu hidden">
      <button data-directive={onNavMenuToggle('nav-menu')} class="backdrop" type="button" />

      <div class="items">
        <div class="item title">Navigation Menu</div>
        <a href="/" class="item anchor">Home</a>
        <a href="/mastery" class="item anchor">Mastery</a>
        <a href="/objectives" class="item anchor">Objectives</a>
        <a href="/transparency" class="item anchor">Transparency</a>
        <div data-auth="loading" class="item title">Loading...</div>
        <a data-auth="false" href="/sign-in" class="item anchor">Sign In</a>
        <a data-auth="false" href="/sign-up" class="item anchor">Sign Up</a>
        <a data-auth="true" href="/sign-up" class="item anchor">Profile</a>
        <a data-auth="true" href="/sign-out" class="item anchor">Sign Out</a>
        <button data-directive={onNavMenuToggle('nav-menu')} class="item btn" type="button">Close Navigation Menu</button>
      </div>
    </div>
  </>
}) satisfies FC
