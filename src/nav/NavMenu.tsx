// app/src/nav/NavMenu.tsx

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

    <div data-auth="undefined" id="nav-menu" class="menu hidden">
      <button data-directive={onNavMenuToggle('nav-menu')} class="backdrop" type="button" />

      <div class="items">
        <div class="item header">
          <span>Navigation</span>
          <button data-directive={onNavMenuToggle('nav-menu')} dangerouslySetInnerHTML={{ __html: svgClose }} class="close" type="button" />
        </div>
        <a href={url['index'].$url().href} class="item anchor">Home</a>
        <a href={url['mastery'][':id?'].$url({ param: { id: '' } }).href} class="item anchor">Mastery</a>
        <a href={url['objectives'].$url().href} class="item anchor">Objectives</a>
        <a href={url['transparency'][':id?'].$url({ param: { id: '' } }).href} class="item anchor">Transparency</a>
        <div data-auth="loading" class="item title">Loading...</div>
        <a data-auth="false" href={url['sign-in'].$url().href} class="item anchor">Sign In</a>
        <a data-auth="false" href={url['sign-up'].$url().href} class="item anchor">Sign Up</a>
        <a data-auth="true" href={url.profile.$url().href} class="item anchor">Profile</a>
        <a data-auth="true" href={url['sign-out'].$url().href} class="item anchor">Sign Out</a>
      </div>
    </div>
  </>
}) satisfies FC
