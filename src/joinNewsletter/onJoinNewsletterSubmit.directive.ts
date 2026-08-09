// app/src/joinNewsletter/joinNewsletter.directive.ts

import { Loading, FormUtil } from '@hono-security'
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

      const response = await fetch('/api/join-newsletter', {
        method: 'POST',
        body: JSON.stringify(result.data),
        headers: { 'Content-Type': 'application/json' },
      })

      loading.stop()

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      await response.json()

      form.resetForm()

      alert('✅ Message sent successfully!') // will be a toast notification later
    } catch (error) {
      console.error('❌ Submission error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      loading.stop()
    }
  })
}
