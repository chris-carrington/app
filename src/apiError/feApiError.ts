// app/src/apiError/feApiError.ts

import { showErrorToast } from '@hono-toast'

export function feApiError(error: unknown) {
  console.error(error)
  
  let message = (error && typeof error === 'object' && 'cause' in error && error.cause && typeof error.cause === 'object' && 'error' in error.cause && typeof error.cause.error === 'string')
    ? error.cause.error
    : `An unexpected error happened, I'm sorry, please feel free to try again and/or contact us to help bring this error to our awareness`

  showErrorToast(message)
}
