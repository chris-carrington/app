// app/src/joinLeadership/joinLeadership.directive.ts

import { Loading, FormUtil } from '@hono-security'
import { joinLeadershipValidator } from '@src/joinLeadership/joinLeadership.validator'


export default (el: HTMLFormElement) => {
  const form = new FormUtil(el, joinLeadershipValidator)

  el.addEventListener('submit', async (e) => {
    e.preventDefault()

    const result = form.validateForm()

    if (!result.success) return

    const loading = new Loading(el)

    try {
      loading.start()

      const response = await fetch('/api/join-leadership', {
        method: 'POST',
        body: JSON.stringify(result.data),
        headers: { 'Content-Type': 'application/json' },
      })

      loading.stop()

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      await response.json()

      form.resetForm()

      alert('✅ Success!') // will be a toast notification later
    } catch (error) {
      console.error('❌ Submission error:', error)
      alert('❌ Error!')
    } finally {
      loading.stop()
    }
  })
}
