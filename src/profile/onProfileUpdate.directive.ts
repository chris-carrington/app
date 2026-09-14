// app/src/profile/onProfileUpdate.directive.ts

import { query } from '@hono-dom'
import { showToast } from '@hono-toast'
import { idAvatar } from '@src/lib/dom'
import type { AppType } from '@src/index'
import { FormUtil, Loading } from '@hono-form'
import { createRPC, onError } from '@hono-api/fe'
import { profileUpdateValidator } from '@src/validators/profileUpdate.validator'


export default (el: HTMLFormElement) => {
  const loading = new Loading(el)
  const rpc = createRPC<AppType>()
  const form = new FormUtil(el, profileUpdateValidator)
  const imgAvatar = query<HTMLImageElement>(idAvatar().query).one()

  el.addEventListener('submit', async e => {
    e.preventDefault()

    const result = form.validateForm()
    if (!result.success) return

    try {
      loading.start()

      const { res } = await form.rpc(rpc.api['profile'].$put, { form: { firstName: result.data.firstName, lastName: result.data.lastName, img: result.data.img } })

      if (res.success) {
        if (res.imageId) {
          imgAvatar.src = `https://r2.shastatrades.org/${res.imageId}.webp`
          imgAvatar.style.display = 'block'
        }

        showToast({ variant: 'success', value: 'Success!' })
      }
    } catch (e) {
      form.catch(e, onError)
    } finally {
      loading.stop()
    }
  })
}
