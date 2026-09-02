// app/src/serviceRequest/serviceRequest.directive.ts

import { rpcFE } from '@hono-rpc/fe'
import type { AppType } from '@src/index'
import { Loading, FormUtil } from '@hono-security'
import { serverErrorMessage } from '@src/lib/vars'
import { showToast, showErrorToast } from '@hono-toast'
import { serviceRequestValidator } from '@src/validators/serviceRequest.validator'


export default (el: HTMLFormElement) => {
  const rpc = rpcFE<AppType>()
  const form = new FormUtil(el, serviceRequestValidator)

  el.addEventListener('submit', async (e) => {
    e.preventDefault()

    const result = form.validateForm()

    if (!result.success) return

    const loading = new Loading(el)

    try {
      loading.start()

      const response = await rpc.api['service-request'].$post({ json: result.data })

      loading.stop()

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      await response.json()

      form.resetForm()

      showToast({ value: 'Success!', variant: 'success' })
    } catch (error) {
      console.error('❌ Submission error:', error)
      showErrorToast(serverErrorMessage)
    } finally {
      loading.stop()
    }
  })
}
