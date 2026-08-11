// app/src/lib/sendEmail.ts

import * as v from 'valibot'
import { env } from 'cloudflare:workers'


export async function sendEmail(props: SendEmailProps): Promise<Response> {
  try {
    const res = await callApi(props)
    const parsed = v.safeParse(ApiResponseSchema, res.apiResponseData)

    if (!parsed.success) return onValibotParseError(props)
    if (!parsed.output.success) return onApiError(props, res.apiResponse, parsed.output)
    if (props.onSuccess) return props.onSuccess(parsed.output.result)

    return onDefaultSuccess(parsed.output)
  } catch (error) {
    return onCatch(props, error)
  }
}


async function callApi(props: SendEmailProps): Promise<{ apiResponse: Response, apiResponseData: unknown}> {
  const apiResponse = await fetch(env.CLOUDFLARE_EMAIL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.CLOUDFLARE_EMAIL_API_TOKEN}`,
    },
    body: JSON.stringify({
      to: props.to,
      subject: props.subject,
      html: props.html,
      from: 'support@shastatrades.org',
    }),
  })

  return {
    apiResponse,
    apiResponseData: await apiResponse.json()
  }
}


function onValibotParseError(props: SendEmailProps) {
  const fallbackError = {
    code: 500,
    message: 'Unexpected API response format',
  }

  if (props.onError) return props.onError(fallbackError)

  return new Response(
    JSON.stringify(fallbackError),
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  )
}


function onApiError(props: SendEmailProps, apiResponse: Response, parsedData: ApiErrorResponse) {
  const firstError = parsedData.errors[0] ?? { code: 500, message: 'Unknown error' }
  const errorObj = { code: firstError.code, message: firstError.message }

  if (props.onError) return props.onError(errorObj)

  return new Response(
    JSON.stringify(errorObj),
    { status: apiResponse.status, headers: { 'Content-Type': 'application/json' } }
  )
}


function onCatch(props: SendEmailProps, error: unknown) {
  const errorObj = {
    code: 500,
    message: error instanceof Error ? error.message : 'Unknown error',
  }

  if (props.onError) return props.onError(errorObj)

  return new Response(
    JSON.stringify(errorObj),
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  )
}


function onDefaultSuccess(output: ApiSuccessResponse) {
  return new Response(
    JSON.stringify({ success: true, messageId: output.result }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}


const ApiSuccessResponseSchema = v.object({
  success: v.literal(true),
  result: v.pipe(
    v.object({
      id: v.optional(v.string()),
      message_id: v.optional(v.string()),
    }),
    v.transform((input) => input.id ?? input.message_id ?? ''),
    v.minLength(1, 'Missing message ID in response'),
  ),
  errors: v.optional(v.array(v.any())),
  messages: v.optional(v.array(v.any())),
})


const ApiErrorResponseSchema = v.object({
  success: v.literal(false),
  errors: v.array(v.object({
    code: v.number(),
    message: v.string(),
  })),
  messages: v.optional(v.array(v.any())),
})


const ApiResponseSchema = v.union([ApiSuccessResponseSchema, ApiErrorResponseSchema])


type ApiSuccessResponse = v.InferOutput<typeof ApiSuccessResponseSchema>


type ApiErrorResponse = v.InferOutput<typeof ApiErrorResponseSchema>


export type SendEmailProps = {
  to: string
  subject: string
  html: string
  onSuccess?: (messageId: string) => Response
  onError?: (error: { code: number, message: string }) => Response
}
