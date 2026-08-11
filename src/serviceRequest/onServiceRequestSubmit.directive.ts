// app/src/serviceRequest/serviceRequest.directive.ts

import { Loading, FormUtil } from '@hono-security'
import { showToast, showErrorToast } from '@hono-toast'
import { serviceRequestValidator } from '@src/serviceRequest/serviceRequest.validator'


export default (el: HTMLFormElement) => {
  const form = new FormUtil(el, serviceRequestValidator)

  el.addEventListener('submit', async (e) => {
    e.preventDefault()

    const result = form.validateForm()

    if (!result.success) return

    const loading = new Loading(el)

    try {
      loading.start()

      const response = await fetch('/api/service-request', {
        method: 'POST',
        body: JSON.stringify(result.data),
        headers: { 'Content-Type': 'application/json' },
      })

      loading.stop()

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      await response.json()

      form.resetForm()

      showToast({ value: 'Success!', variant: 'success' })
    } catch (error) {
      console.error('❌ Submission error:', error)
      showErrorToast(String(error))
    } finally {
      loading.stop()
    }
  })
}
