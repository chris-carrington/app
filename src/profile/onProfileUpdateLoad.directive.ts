// app/src/profile/onProfileUpdateLoad.directive.ts

import { query } from '@hono-dom'
import { showToast } from '@hono-toast'
import type { AppType } from '@src/index'
import { FormUtil, Loading } from '@hono-form'
import { createRPC, onError } from '@hono-api/fe'
import { imgWebpEvents, onFileChange } from '@img-webp'
import { idAvatar, idProfileUpdateSaveBtn } from '@src/lib/dom'
import { profileUpdateValidator } from '@src/validators/profileUpdate.validator'


export default (el: HTMLFormElement) => {
  const loading = new Loading(el)
  const rpc = createRPC<AppType>()
  const imgAvatar = query<HTMLImageElement>(idAvatar().query).one()
  const btnProfileUpdateSaveBtn = query<HTMLButtonElement>(idProfileUpdateSaveBtn().query).one()
  const form = new FormUtil(el, profileUpdateValidator, (input) => onFileChange(input, { aimWidth: 450 }))


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


  imgWebpEvents.on('filesTransmuting', filesTransmuting => {
    if (filesTransmuting) {
      btnProfileUpdateSaveBtn.disabled = true
      btnProfileUpdateSaveBtn.textContent = 'Compressing Image...'
    } else {
      btnProfileUpdateSaveBtn.disabled = false
      btnProfileUpdateSaveBtn.textContent = 'Save'
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
