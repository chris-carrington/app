// app/src/auth/onSignInSubmit.directive.ts

import { FormUtil, Loading } from '@hono-security'
import { showToast, showErrorToast } from '@hono-toast'
import { signInValidator } from '@src/auth/signIn.validator'


export default (el: HTMLFormElement) => {
  const form = new FormUtil(el, signInValidator)

  el.addEventListener('submit', async (e) => {
    e.preventDefault()

    const result = form.validateForm()

    if (!result.success) return

    const loading = new Loading(el)

    try {
      loading.start()

      const response = await fetch('/api/sign-in', {
        method: 'POST',
        body: JSON.stringify(result.data),
        headers: { 'Content-Type': 'application/json' },
      })

      loading.stop()

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      await response.json()

      form.resetForm()
      
      showToast({ value: 'Success! Please click the "Sign In" button w/in your email inbox/spam folder w/in the next 9 minutes!', variant: 'success', ms: Infinity })
    } catch (error) {
      console.error('❌ Submission error:', error)
      showErrorToast(String(error))
    } finally {
      loading.stop()
    }
  })
}
