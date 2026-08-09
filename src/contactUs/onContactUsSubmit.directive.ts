// app/src/contactUs/contactUs.directive.ts

import { showToast } from '@hono-toast'
import { Loading, FormUtil } from '@hono-security'
import { contactUsValidator } from '@src/contactUs/contactUs.validator'


export default (el: HTMLFormElement) => {
  const form = new FormUtil(el, contactUsValidator)

  el.addEventListener('submit', async (e) => {
    e.preventDefault()

    const result = form.validateForm()

    if (!result.success) return

    const loading = new Loading(el)

    try {
      loading.start()

      const response = await fetch('/api/contact-us', {
        method: 'POST',
        body: JSON.stringify(result.data),
        headers: { 'Content-Type': 'application/json' },
      })

      loading.stop()

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      await response.json()

      form.resetForm()

      showToast({ value: 'Success!', variant: 'success', position: 'bottomRight' })
    } catch (error) {
      console.error('❌ Submission error:', error)
      showToast({ value: String(error), variant: 'danger' })
    } finally {
      loading.stop()
    }
  })
}
