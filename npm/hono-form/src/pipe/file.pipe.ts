// app/npm/hono-form/src/pipe/file.pipe.ts

import * as v from 'valibot'



// Overload for optional: true
export function pipeFile<
  const TNotFile extends string,
  const TMimeTypes extends `${string}/${string}`[],
  const TMimeError extends string,
  const TMaxSizeError extends string,
>(
  props: BaseProps<TNotFile, TMimeTypes, TMimeError, TMaxSizeError> & { optional: true }
): v.OptionalSchema<BuildPipeSchema<TNotFile, TMimeTypes, TMimeError, TMaxSizeError>, undefined>



// Overload for optional: false / undefined
export function pipeFile<
  const TNotFile extends string,
  const TMimeTypes extends `${string}/${string}`[],
  const TMimeError extends string,
  const TMaxSizeError extends string,
>(
  props: BaseProps<TNotFile, TMimeTypes, TMimeError, TMaxSizeError> & { optional?: false }
): BuildPipeSchema<TNotFile, TMimeTypes, TMimeError, TMaxSizeError>



/**
 * ### File validation
 * @param props.notFileError Error to show when a file is not provided
 * @param props.mimeType Tuple, 1st value is an array of allowed mime types, 2nd value is the error when the provided mime type is invalid
 * @param props.maxSize Tuple, 1st value is max size in bytes, 2nd value is the error when the provided file size is too big
 * @param props.optional Optional, when true then a file not being provided is also valid
 */
export function pipeFile(props: {
  notFileError: string
  maxSize: [number, string]
  mimeType: [readonly `${string}/${string}`[], string]
  optional?: boolean
}) {
  const baseSchema = v.pipe(
    v.file(props.notFileError),
    v.mimeType(props.mimeType[0] as `${string}/${string}`[], props.mimeType[1]),
    v.maxSize(props.maxSize[0], props.maxSize[1]),
  )

  return props.optional ? v.optional(baseSchema) : baseSchema
}


/* props that are the same between overloads */
type BaseProps<
  TNotFile extends string,
  TMimeTypes extends `${string}/${string}`[],
  TMimeError extends string,
  TMaxSizeError extends string,
> = {
  notFileError: TNotFile
  maxSize: [number, TMaxSizeError]
  mimeType: [readonly [...TMimeTypes], TMimeError]
}


/* Helper type to build the inner v.pipe schema matching exact literal inputs */
type BuildPipeSchema<
  TNotFile extends string,
  TMimeTypes extends `${string}/${string}`[],
  TMimeError extends string,
  TMaxSizeError extends string,
> = ReturnType<
  typeof v.pipe<
    v.FileSchema<TNotFile>,
    v.MimeTypeAction<File, TMimeTypes, TMimeError>,
    v.MaxSizeAction<File, number, TMaxSizeError>
  >
>
