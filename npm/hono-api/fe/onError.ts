// app/npm/hono-api/fe/onError.ts

import { showErrorToast } from '@hono-toast'


/**
 * ### Transmute an Error that is caught on the `FE` into a toast notification
 * @param error IF this is a standard API Error w/ `error.cause.message` defined THEN we will put that message into the toast. `FormUtil.responseThrow()` adds json response data to the thrown error for us. Toast notification will remain visible until someone closes it. IF the API did not provide an error message THEN we will show this in the toast: `An unexpected error happened, I'm sorry, please feel free to try again and/or contact us to help bring this error to our awareness`
 */
export function onError(error: unknown) {
  console.error(error)
  
  let message = (error && typeof error === 'object' && 'cause' in error && error.cause && typeof error.cause === 'object' && 'message' in error.cause && typeof error.cause.message === 'string')
    ? error.cause.message
    : `An unexpected error happened, I'm sorry, please feel free to try again and/or contact us to help bring this error to our awareness`

  showErrorToast(message)
}
