// app/send-cloudflare-email/index.ts

import * as v from 'valibot'
import { env } from 'cloudflare:workers'


/**
 * ### Send an email using Cloudflare's email API
 * - Requires in `.env`
 *     - `CLOUDFLARE_EMAIL_API_URL`
 *     - `CLOUDFLARE_EMAIL_API_TOKEN`
 * @link https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/
 * @link https://developers.cloudflare.com/fundamentals/api/get-started/create-token/
 * @link https://developers.cloudflare.com/email-service/api/send-emails/rest-api
 * @link https://developers.cloudflare.com/api/resources/email_sending/methods/send/
 */
export async function sendCloudflareEmail(props: SendEmailProps): Promise<Response> {
  try {
    const res = await callApi(props)
    const parsed = v.safeParse(ApiResponseSchema, res.apiResponseData)

    if (!parsed.success) return onValibotParseError(props)
    if (!parsed.output.success) return onApiError(props, res.apiResponse, parsed.output)
    if (props.onSuccess) return props.onSuccess(parsed.output)

    return onDefaultSuccess(parsed.output)
  } catch (error) {
    return onCatch(props, error)
  }
}


async function callApi(props: SendEmailProps): Promise<{ apiResponse: Response, apiResponseData: unknown }> {
  const apiResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/email/sending/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.CLOUDFLARE_EMAIL_API_TOKEN}`,
    },
    body: JSON.stringify({
      from: props.from,
      to: props.to,
      subject: props.subject,
      html: props.html,
    }),
  })

  return {
    apiResponse,
    apiResponseData: await apiResponse.json()
  }
}


function onValibotParseError(props: SendEmailProps) {
  const fallbackError: ApiErrorResponse = {
    success: false,
    errors: [{ code: 500, message: 'Unexpected API response format' }],
  }

  if (props.onError) return props.onError(fallbackError)

  return respond(fallbackError, 500)
}


function onApiError(props: SendEmailProps, apiResponse: Response, parsedData: ApiErrorResponse) {
  if (props.onError) return props.onError(parsedData)

  return respond(parsedData, apiResponse.status)
}


function onCatch(props: SendEmailProps, error: unknown) {
  const fallbackError: ApiErrorResponse = {
    success: false,
    errors: [{ code: 500, message: error instanceof Error ? error.message : 'Unknown error' }],
  }

  if (props.onError) return props.onError(fallbackError)

  return respond(fallbackError, 500)
}


function onDefaultSuccess(output: ApiSuccessResponse) {
  return respond(output, 200)
}


function respond(data: v.InferOutput<typeof ApiResponseSchema>, status: number) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: { 'Content-Type': 'application/json' }
  })
}


const ApiSuccessResponseSchema = v.object({
  success: v.literal(true),
  result: v.object({
    delivered: v.array(v.string()),
    message_id: v.string(),
    permanent_bounces: v.array(v.string()),
    queued: v.array(v.string()),
  }),
  errors: v.optional(v.array(v.any())),
  messages: v.optional(v.array(v.any())),
  result_info: v.optional(v.object({
    count: v.number(),
    per_page: v.number(),
    total_count: v.number(),
    cursor: v.optional(v.string()),
    page: v.optional(v.number()),
  })),
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
  to: string,
  from: string,
  html: string,
  subject: string,
  onError?: (response: ApiErrorResponse) => Response
  onSuccess?: (response: ApiSuccessResponse) => Response
}
