// app/src/apiError/feApiError.ts

import { showErrorToast } from '@hono-toast'

export function feApiError(error: unknown) {
  console.error(error)
  
  let message = (error && typeof error === 'object' && 'cause' in error && error.cause && typeof error.cause === 'object' && 'message' in error.cause && typeof error.cause.message === 'string')
    ? error.cause.message
    : `An unexpected error happened, I'm sorry, please feel free to try again and/or contact us to help bring this error to our awareness`

  showErrorToast(message)
}
