// app/src/profile/onProfileUpdate.directive.ts

import { query } from '@hono-dom'
import { showToast } from '@hono-toast'
import { idAvatar } from '@src/lib/dom'
import { onInputChange } from '@img-webp'
import type { AppType } from '@src/index'
import { FormUtil, Loading } from '@hono-form'
import { createRPC, onError } from '@hono-api/fe'
import { profileUpdateValidator } from '@src/validators/profileUpdate.validator'


export default (el: HTMLFormElement) => {
  const loading = new Loading(el)
  const rpc = createRPC<AppType>()
  const imgAvatar = query<HTMLImageElement>(idAvatar().query).one()
  const form = new FormUtil(el, profileUpdateValidator, onInputChange)

  el.addEventListener('submit', async e => {
    e.preventDefault()

    const result = form.validateForm()
    if (!result.success) return

    try {
      loading.start()

      const { res } = await form.rpc(rpc.api['profile'].$put, { form: { firstName: result.data.firstName, lastName: result.data.lastName, img: result.data.img } })

      if (res.success) {
        if (res.imageId) await setDomImg(imgAvatar, res.imageId)
        showToast({ variant: 'success', value: 'Success!' })
      }
    } catch (e) {
      form.catch(e, onError)
    } finally {
      loading.stop()
    }
  })
}


/**
 * - Preload and decode the image asynchronously before updating DOM
 * - decode() ensures the image is fetched and decoded in memory
 * - Helps us ensure that the image shows and then we show the toast and stop the loading indicator
 */
async function setDomImg(imgAvatar: HTMLImageElement, imageId: string) {
  const tempImg = new Image()
  const newSrc = `https://r2.shastatrades.org/${imageId}.webp`  

  tempImg.src = newSrc
  await tempImg.decode().catch(() => { })

  imgAvatar.src = newSrc
  imgAvatar.style.display = 'block'
}
