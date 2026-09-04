// app/src/apiError/feApiError.ts

import { showErrorToast } from '@hono-toast'

export function feApiError(error: unknown) {
  console.error(error)
  showErrorToast(`An unexpected error happened, I'm sorry, please feel free to try again and/or contact us to help bring this error to our awareness`)
}
