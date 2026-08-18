// app/npm/send-cloudflare-email/index.ts

import * as v from 'valibot'


/**
 * ### Send an email w/ Cloudflare's email API
 * @link https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/
 * @link https://developers.cloudflare.com/fundamentals/api/get-started/create-token/
 * @link https://developers.cloudflare.com/email-service/api/send-emails/rest-api
 * @link https://developers.cloudflare.com/api/resources/email_sending/methods/send/
 */
export async function sendEmail(props: SendEmailProps): Promise<ApiResponse> {
  try {
    const apiResponse = await callApi(props)
    const apiParsed = await parseApiResponse(apiResponse)

    if (!apiParsed.success) {
      return onApiError(props, {
        success: false,
        errors: [
          { code: apiResponse.status, message: `API HTTP Error, Status: ${apiResponse.status}, Status Text: ${apiResponse.statusText}` }
        ]
      })
    }

    const vResponse = v.safeParse(ApiResponseSchema, apiParsed.data)

    if (!vResponse.success) return onValibotError(props, vResponse)
    if (!vResponse.output.success) return onApiError(props, vResponse.output)
    if (props.onSuccess) return props.onSuccess(vResponse.output)

    return vResponse.output
  } catch (error) {
    return onCatch(props, error)
  }
}


async function callApi(props: SendEmailProps): Promise<Response> {
  return await fetch(`https://api.cloudflare.com/client/v4/accounts/${props.accountId}/email/sending/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${props.apiToken}`,
    },
    body: JSON.stringify({
      from: props.from,
      to: props.to,
      subject: props.subject,
      html: props.html,
    }),
  })
}


async function parseApiResponse(response: Response): Promise<{ success: boolean, data: unknown }> {
  const parsed = { success: true, data: null }

  try {
    parsed.data = await response.json()
  } catch {
    parsed.success = false
  }

  return parsed
}


function onValibotError(props: SendEmailProps, parsed: v.SafeParseResult<any>): ApiResponse {
  const valibotError = parseValibotIssues(parsed.issues ?? [])

  return props.onError ? props.onError(valibotError) : valibotError
}


function parseValibotIssues(issues: v.BaseIssue<unknown>[]): ApiErrorResponse {
  return {
    success: false,
    errors: issues.map((issue) => ({
      code: 400,
      message: `Validation error at ${issue.path?.map(p => p.key).join('.') ?? 'root'}: ${issue.message}`,
    })),
  }
}


function onApiError(props: SendEmailProps, parsedData: ApiErrorResponse): ApiResponse {
  return props.onError ? props.onError(parsedData) : parsedData
}


function onCatch(props: SendEmailProps, error: unknown): ApiResponse {
  const message = error instanceof Error
    ? error.message
    : String(error)
    ? String(error)
    : 'Unknown error'

  const errorResponse: ApiErrorResponse = {
    success: false,
    errors: [{ code: 500, message }],
  }

  return props.onError ? props.onError(errorResponse) : errorResponse
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


export type ApiResponse = v.InferOutput<typeof ApiResponseSchema>


export type SendEmailProps = {
  to: string,
  from: string,
  html: string,
  subject: string,
  apiToken: string,
  accountId: string,
  onError?: (response: ApiErrorResponse) => ApiResponse
  onSuccess?: (response: ApiSuccessResponse) => ApiResponse
}
