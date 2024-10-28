import type { MaybePromise } from './types'
import type { Data } from './data'
import { type Reply, ReplyFactory, Status } from './reply'
import type { Logger } from './logger'
import type { ZodType } from 'zod'

export type MiddlewareHandler = (input: { event: any; env: Environment; logger: Logger }) => MaybePromise<void>

export interface Middleware<T> {
  name?: string
  requires?: MiddlewareList
  replies?: Partial<Record<Status, ZodType>>
  handler: (input: { event: any; env: Environment; logger: Logger }) => MaybePromise<void>
}

// export type MiddlewareList = readonly [...readonly Middleware<any>[]]

export type MiddlewareList = readonly [...readonly MW<any, any>[]]

export type ExtensionFrom<MW> = MW extends Middleware<infer Extension> ? Extension : never
export type ExtensionsFrom<MWs, Accumulator = unknown> = MWs extends readonly [infer Current, ...infer Rest]
  ? ExtensionsFrom<Rest, Accumulator & ExtensionFrom<Current>>
  : Accumulator

export type MiddlewareContext =
  | { isDurableObject: true; state: DurableObjectState }
  | { isDurableObject: false; ctx: ExecutionContext }

export class NextData<const T extends Record<string, unknown> = Record<never, never>> {
  // @ts-expect-error data could use better typing
  constructor(public data: T = {}) {}
}

type NextFn = <const T extends Record<string, unknown> = Record<never, never>>(data?: T) => NextData<T>

export const next: NextFn = (extension?: any) => new NextData(extension)

function nextFn<const Extension extends Record<string, unknown>>(data?: Extension) {
  return new NextData(data)
}


export type MwOptions<
  Requires extends MiddlewareList = []
> = {
  name?: string
  requires?: Requires
  replies?: Partial<Record<Status, ZodType>> | undefined
}

export type MwHandler<
  Requires extends MiddlewareList = [],
  Extension extends Record<string, unknown> = Record<never, never>
> = (input: {
  event: Data & { reply: ReplyFactory; next: NextFn; body: unknown } & ExtensionsFrom<Requires>
  env: Environment
  ctx: ExecutionContext | DurableObjectState
}) => MaybePromise<NextData<Extension> | Reply>

export type MW<
  Requires extends MiddlewareList = [],
  Extension extends Record<string, unknown> = Record<never, never>
> = {
  options: MwOptions<Requires>
  handler: MwHandler<Requires, Extension>
}

// class Middleware2<> {
//
// }


export function middleware<
  const Extension extends Record<string, unknown> = Record<never, never>
>(
  handler: MwHandler<[], Extension>
): MW<[], Extension>

export function middleware<
  const Requires extends MiddlewareList = [],
  const Extension extends Record<string, unknown> = Record<never, never>
>(
  options: MwOptions<Requires>,
  handler: MwHandler<Requires, Extension>
): MW<Requires, Extension>

export function middleware<
  const Requires extends MiddlewareList = [],
  const Extension extends Record<string, unknown> = Record<never, never>
>(
  options: MwOptions<Requires> | MwHandler<Requires, Extension>,
  handler?: MwHandler<Requires, Extension>
) {
  const _options = typeof options === 'object' ? options : {}
  const _handler = typeof options === 'function' ? options : handler
  if (!_handler) throw new Error('[Comet] A middleware received no handler argument.')

  return { options: _options, handler: _handler }
}
