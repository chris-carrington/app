// app/src/auth/onSignUpSubmit.directive.ts

import { rpcFE } from '@hono-rpc/fe'
import type { AppType } from '@src/index'
import { FormUtil, Loading } from '@hono-security'
import { serverErrorMessage } from '@src/lib/vars'
import { showToast, showErrorToast } from '@hono-toast'
import { signUpValidator } from '@src/validators/signUp.validator'


export default (el: HTMLFormElement) => {
  const rpc = rpcFE<AppType>()
  const form = new FormUtil(el, signUpValidator)

  el.addEventListener('submit', async (e) => {
    e.preventDefault()

    const result = form.validateForm()

    if (!result.success) return

    const loading = new Loading(el)

    try {
      loading.start()

      const response = await rpc.api['sign-up'].$post({ json: result.data })

      loading.stop()

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      await response.json()

      form.resetForm()
      
      showToast({ value: 'Success! Please click the "Sign In" button w/in your email inbox/spam folder w/in the next 9 minutes!', variant: 'success', ms: Infinity })
    } catch (error) {
      console.error('❌ Submission error:', error)
      showErrorToast(serverErrorMessage)
    } finally {
      loading.stop()
    }
  })
}
