// app/src/profile/onProfileLoad.directive.ts

import { query } from '@hono-dom'
import { tabsEvents } from '@hono-tabs'
import { showToast } from '@hono-toast'
import type { AppType } from '@src/index'
import { FormUtil, Loading } from '@hono-form'
import { bindAccordionItems } from '@hono-accordion'
import { imgWebpEvents, onFileChange } from '@img-webp'
import { createRPC, InferRpc, onError } from '@hono-api/fe'
import { profileUpdateValidatorForm } from '@src/validators/profileUpdate.validator'
import { idAvatar, idJobLeads, idContactUsMessages, idEditYourProfile, idStaffLeads, idObjectiveActivity } from '@src/lib/dom'


export default (el: HTMLDivElement) => {
  let editProfileBound = false
  const rpc = createRPC<AppType>()

  tabsEvents.on('tabChanged', async (v) => {
    switch (v.id) {
      case 'finances': return onFinancesTabChange(el)
      case 'job-leads': return onApiHtmlTabChange(rpc, v.id, idJobLeads().query)
      case 'staff-leads': return onApiHtmlTabChange(rpc, v.id, idStaffLeads().query)
      case 'objective-activity': return onApiHtmlTabChange(rpc, v.id, idObjectiveActivity().query)
      case 'contact-us-messages': return onApiHtmlTabChange(rpc, v.id, idContactUsMessages().query)
      case 'edit-your-profile': return editProfileBound = onEditProfileTabChange(rpc, el, editProfileBound)
    }
  })
}


async function onApiHtmlTabChange(rpc: InferRpc<AppType>, apiRoute: 'job-leads' | 'staff-leads' | 'contact-us-messages' | 'objective-activity', $query: string) {
  const container = query<HTMLDivElement>($query).one()

  if (container.firstElementChild instanceof HTMLImageElement) { // IF showing loading icon THEN add content
    const response = apiRoute === 'objective-activity' ? await rpc.api['objective-activity'][':variant'].$get({ param: { variant: 'personal' } }) : await rpc.api[apiRoute].$get()
    container.innerHTML = await response.text()
  }
}


function onFinancesTabChange(el: HTMLDivElement) {
  bindAccordionItems(el)
}


function onEditProfileTabChange(rpc: InferRpc<AppType>, el: HTMLDivElement, editProfileBound: boolean) {
  if (editProfileBound) return editProfileBound

  const elForm = query<HTMLFormElement>(idEditYourProfile().query).root(el).one()
  const loading = new Loading(elForm)
  const imgAvatar = query<HTMLImageElement>(idAvatar().query).one()
  const btnProfileUpdateSaveBtn = query<HTMLButtonElement>('button[type="submit"]').root(el).one()
  const form = new FormUtil(elForm, profileUpdateValidatorForm, (input) => onFileChange(input, { aimWidth: 450 }))


  el.addEventListener('submit', async e => {
    e.preventDefault()

    const result = form.validateForm()
    if (!result.success) return

    try {
      loading.start()

      const { res } = await form.rpc(rpc.api['profile'].$put, {
        form: {
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          img: result.data.img,
          newsletter: result.data.newsletter.length ? 'true' : 'false'
        }
      })

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

  return true
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
