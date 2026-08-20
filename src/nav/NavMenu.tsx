// app/src/nav/NavMenu.tsx

import { Style } from 'hono/css'
import type { FC } from 'hono/jsx'
import { urlBE } from '@src/url/urlBE'
import { menuStyle } from '@src/lib/menuStyle'
import { onNavMenuToggle } from '@hono-directives'


export default (() => {
  const url = urlBE()

  return <>
    <Style>{menuStyle}</Style>

    <div data-auth="undefined" id="nav-menu" class="menu hidden">
      <button data-directive={onNavMenuToggle('nav-menu')} class="backdrop" type="button" />

      <div class="items">
        <div class="item title">Navigation Menu</div>
        <a href={url['index'].$url().href} class="item anchor">Home</a>
        <a href={url['mastery'][':id?'].$url({ param: { id: '' } }).href} class="item anchor">Mastery</a>
        <a href={url['objectives'].$url().href} class="item anchor">Objectives</a>
        <a href={url['transparency'][':id?'].$url({ param: { id: '' } }).href} class="item anchor">Transparency</a>
        <div data-auth="loading" class="item title">Loading...</div>
        <a data-auth="false" href={url['sign-in'].$url().href} class="item anchor">Sign In</a>
        <a data-auth="false" href={url['sign-up'].$url().href} class="item anchor">Sign Up</a>
        <a data-auth="true" href={url.profile.$url().href} class="item anchor">Profile</a>
        <a data-auth="true" href={url['index'].$url().href} class="item anchor">Sign Out</a>
        <button data-directive={onNavMenuToggle('nav-menu')} class="item btn" type="button">Close Navigation Menu</button>
      </div>
    </div>
  </>
}) satisfies FC
