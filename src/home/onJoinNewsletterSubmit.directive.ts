// app/src/joinNewsletter/joinNewsletter.directive.ts

import { rpcFE } from '@hono-rpc/fe'
import { showToast } from '@hono-toast'
import type { AppType } from '@src/index'
import { Loading, FormUtil } from '@hono-security'
import { feApiError } from '@src/apiError/feApiError'
import { joinNewsletterValidator } from '@src/validators/joinNewsletter.validator'


export default (el: HTMLFormElement) => {
  const rpc = rpcFE<AppType>()
  const form = new FormUtil(el, joinNewsletterValidator)

  el.addEventListener('submit', async (e) => {
    e.preventDefault()

    const result = form.validateForm()

    if (!result.success) return

    const loading = new Loading(el)

    try {
      loading.start()

      await form.rpc(rpc.api['join-newsletter'].$post, { json: result.data })

      loading.stop()

      form.resetForm()
      
      showToast({ value: 'Success!', variant: 'success' })
    } catch (error) {
      form.catch(error, feApiError)
    } finally {
      loading.stop()
    }
  })
}
