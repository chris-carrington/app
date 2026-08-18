// app/src/nav/Menu.tsx

import { Style } from 'hono/css'
import type { FC } from 'hono/jsx'
import { menuStyle } from '@src/lib/menuStyle'
import { onMenuToggle } from '@hono-directives'


const Menu: FC = () => {
  return <>
    <Style>{menuStyle}</Style>

    <div class="menu nav-menu hidden">
      <button data-directive={onMenuToggle('.nav-menu')} class="backdrop" type="button" />

      <div class="items">
        <div class="item title">Navigation Menu</div>
        <a href="/" class="item anchor">Home</a>
        <a href="/mastery" class="item anchor">Mastery</a>
        <a href="/objectives" class="item anchor">Objectives</a>
        <a href="/transparency" class="item anchor">Transparency</a>
        <a href="/sign-in" class="item anchor">Sign In</a>
        <a href="/sign-up" class="item anchor">Sign Up</a>
        <button data-directive={onMenuToggle('.nav-menu')} class="item btn" type="button">Close Navigation Menu</button>
      </div>
    </div>
  </>
}


export default Menu
