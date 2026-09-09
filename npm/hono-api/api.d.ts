/** API Success Response Type */
export type ApiSuccess<T_Data = undefined> = {
  success: true
} & (T_Data extends undefined ? {} : T_Data)



/** API Error Response Type */
export type ApiError<T_Data = undefined> = {
  success: false
  message?: string
} & (T_Data extends undefined ? {} : T_Data)


/** API Response Type */
export type ApiResponse<TSuccess = undefined, TError = undefined> =
  | ApiSuccess<TSuccess>
  | ApiError<TError>
