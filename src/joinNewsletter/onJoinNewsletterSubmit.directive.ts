// app/src/joinNewsletter/joinNewsletter.directive.ts

import { urlFE } from '@src/url/urlFE'
import { Loading, FormUtil } from '@hono-security'
import { showToast, showErrorToast } from '@hono-toast'
import { joinNewsletterValidator } from '@src/joinNewsletter/joinNewsletter.validator'


export default (el: HTMLFormElement) => {
  const form = new FormUtil(el, joinNewsletterValidator)

  el.addEventListener('submit', async (e) => {
    e.preventDefault()

    const result = form.validateForm()

    if (!result.success) return

    const loading = new Loading(el)

    try {
      loading.start()

      const response = await urlFE().api['join-newsletter'].$post({ json: result.data })

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
