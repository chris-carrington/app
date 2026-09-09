// app/src/auth/onSignInSubmit.directive.ts

import { showToast } from '@hono-toast'
import type { AppType } from '@src/index'
import { createRPC, onError } from '@hono-api/fe'
import { FormUtil, Loading } from '@hono-form'
import { signInValidator } from '@src/validators/signIn.validator'


export default (el: HTMLFormElement) => {
  const rpc = createRPC<AppType>()
  const form = new FormUtil(el, signInValidator)

  el.addEventListener('submit', async (e) => {
    e.preventDefault()

    const result = form.validateForm()

    if (!result.success) return

    const loading = new Loading(el)

    try {
      loading.start()

      await form.rpc(rpc.api['sign-in'].$post, {json: result.data})

      loading.stop()

      form.resetForm()
      
      showToast({ value: 'Success! Please click the "Sign In" button w/in your email inbox/spam folder w/in the next 9 minutes!', variant: 'success', ms: Infinity })
    } catch (error) {
      form.catch(error, onError)
    } finally {
      loading.stop()
    }
  })
}
