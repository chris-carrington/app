// app/src/nav/Menu.tsx

import { Style } from 'hono/css'
import type { FC } from 'hono/jsx'
import { menuStyle } from '@src/lib/menuStyle'
import { onMenuToggle } from '@hono-directives'


const Menu: FC = () => {
  return <>
    <Style>{menuStyle}</Style>

    <div class="menu auth-menu hidden">
      <button data-directive={onMenuToggle('.auth-menu')} class="backdrop" type="button" />

      <div class="items">
        <div class="item title">Auth Menu</div>
        <a href="/sign-in" class="item anchor">Sign In</a>
        <a href="/sign-up" class="item anchor">Sign Up</a>
        <button data-directive={onMenuToggle('.auth-menu')} class="item btn" type="button">Close Auth Menu</button>
      </div>
    </div>
  </>
}


export default Menu
