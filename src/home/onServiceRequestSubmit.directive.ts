// app/src/serviceRequest/serviceRequest.directive.ts

import { showToast } from '@hono-toast'
import type { AppType } from '@src/index'
import { onError, createRPC } from '@hono-api/fe'
import { Loading, FormUtil } from '@hono-form'
import { serviceRequestValidator } from '@src/validators/serviceRequest.validator'


export default (el: HTMLFormElement) => {
  const rpc = createRPC<AppType>()
  const form = new FormUtil(el, serviceRequestValidator)

  el.addEventListener('submit', async (e) => {
    e.preventDefault()

    const result = form.validateForm()

    if (!result.success) return

    const loading = new Loading(el)

    try {
      loading.start()

      await form.rpc(rpc.api['service-request'].$post, { json: result.data })

      loading.stop()

      form.resetForm()

      showToast({ value: 'Success!', variant: 'success' })
    } catch (error) {
      form.catch(error, onError)
    } finally {
      loading.stop()
    }
  })
}
