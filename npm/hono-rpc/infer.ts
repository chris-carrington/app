// app/npm/hono-rpc/infer.ts

import type { Hono } from 'hono'
import type { hc, InferRequestType, InferResponseType } from 'hono/client'


/**
 * ### Helpful when we'd love to accept `rpc` as a function argument
 * @example
    ```
    import type { AppType } from '@src/index'
    import { rpcBE, type InferRpc } from '@hono-rpc/be'

    function foo() {
      const rpc = rpcBE<AppType>()
      console.log(bar(rpc))
    }

    function bar(rpc: InferRpc<AppType>): string {
      return rpc.objectives.$url().href
    }
    ```
 */
export type InferRpc<T_AppType extends Hono<any, any, any>> = ReturnType<typeof hc<T_AppType>>



/**
 * ### Helpful when we'd love typesafety for an endpoint's json request body
 * @example
    ```
    import type { AppType } from '@src/index'
    import { rpcBE, type InferJson } from '@hono-rpc/be'

    const rpc = rpcBE<AppType>()

    function foo() {
      const response = rpc.api.objective.$post(bar())
      console.log(response)
    }

    function bar(): InferJson<typeof rpc.api.objective.$post> {
        return {
          message: 'Example message'
        }
      }

    
    ```
 */
export type InferJson<T_Method> = InferRequestType<T_Method> extends { json: infer T_Json } ? T_Json : never



/**
 * ### Helpful when we'd love typesafety for an endpoint's url request query params
 * @example
    ```
    import type { AppType } from '@src/index'
    import { rpcBE, type InferQuery } from '@hono-rpc/be'

    const rpc = rpcBE<AppType>()

    function foo() {
      const response = rpc.api.objective.$get(bar())
      console.log(response)
    }

    function bar(): InferQuery<typeof rpc.api.objective.$get> {
      return { page: 1, limit: 10 }
    }
    ```
 */
export type InferQuery<T_Method> = InferRequestType<T_Method> extends { query: infer T_Query } ? T_Query : never


/**
 * ### Helpful when we'd love typesafety for an endpoint's url request path params
 * @example
    ```
    import type { AppType } from '@src/index'
    import { rpcBE, type InferParam } from '@hono-rpc/be'

    const rpc = rpcBE<AppType>()

    function foo() {
      const response = rpc.api.objective[':variant'].$get(bar())
      console.log(response)
    }

    function bar(): InferParam<typeof rpc.api.objective[':variant'].$get> {
      return { variant: 'abd' }
    }
    ```
 */
export type InferParam<T_Method> = InferRequestType<T_Method> extends { param: infer T_Params } ? T_Params : never


/**
 * ### Helpful when we'd love typesafety for an endpoint's custom request headers
 * @example
    ```
    import type { AppType } from '@src/index'
    import { rpcBE, type InferHeader } from '@hono-rpc/be'

    const rpc = rpcBE<AppType>()

    function foo() {
      const response = rpc.api.objective.$get(bar('abc'))
      console.log(response)
    }

    function bar(token: string): InferHeader<typeof rpc.api.objective.$get> {
      return {
        Authorization: 'Bearer ' + token
      }
    }
    ```
 */
export type InferHeader<T_Method> = InferRequestType<T_Method> extends { header: infer T_Headers } ? T_Headers : never


/**
* ### Helpful when we'd love typesafety for an endpoint's request cookies
* @example
  ```
  import type { AppType } from '@src/index'
  import { rpcBE, type InferCookie } from '@hono-rpc/be'

  const rpc = rpcBE<AppType>()

  function foo() {
    const response = rpc.api.objective.$get(bar())
    console.log(response)
  }

  function bar(): InferCookie<typeof rpc.api.objective.$get> {
    return {
      sessionId: 1
    }
  }
  ```
*/
export type InferCookie<T_Method> = InferRequestType<T_Method> extends { cookie: infer T_Cookies } ? T_Cookies : never


/**
* ### Helpful when we'd love typesafety for an endpoint's request `FormData` multipart body
* @example
  ```
  import type { AppType } from '@src/index'
  import { rpcBE, type InferForm } from '@hono-rpc/be'

  const rpc = rpcBE<AppType>()

  async function foo(file: File): InferResponse<typeof rpc.api.objective.$post> {
    const response = await rpc.api.objective.$post(bar(file))
    return await response.json()
  }

  function bar(file: File): InferForm<typeof rpc.api.objective.$post> {
    const formData = new FormData()
    formData.append('file', file)
    return formData
  }
  ```
*/
export type InferForm<T_Method> = InferRequestType<T_Method> extends { form: infer T_Form } ? T_Form : never


/**
* ### Helpful when we'd love typesafety for an endpoint's response
* @example
  ```
  import type { AppType } from '@src/index'
  import { rpcBE, type InferResponse } from '@hono-rpc/be'

  const rpc = rpcBE<AppType>()

  async function foo() {
    console.log(await bar())
  }

  async function bar(): InferResponse<typeof rpc.api.objective.$get> {
    const response = await rpc.api.objective.$get()
    return await response.json()
  }
  ```
*/
export type InferResponse<T_Method> = InferResponseType<T_Method>
