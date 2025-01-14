import type { MaybePromise } from './types'
import type { Data } from './data'
import { type Reply, type ReplyFrom, Status } from './reply'
import type { Logger } from './logger'
import type { ZodType } from 'zod'

export type MiddlewareHandler = (input: { event: any; env: Environment; logger: Logger }) => MaybePromise<void>

export interface Middleware<T> {
  name?: string
  requires?: MiddlewareList
  handler: (input: {
    event: any;
    env: Environment;
    ctx: ExecutionContext | DurableObjectState
    logger: Logger
  }) => MaybePromise<void>
  replies?: Partial<Record<Status, ZodType>>
}

export type MiddlewareList = readonly [...readonly Middleware<any>[]]

export type ExtensionFrom<MW> = MW extends Middleware<infer Extension> ? Extension : never
export type ExtensionsFrom<MWs, Accumulator = unknown> = MWs extends readonly [infer Current, ...infer Rest]
  ? ExtensionsFrom<Rest, Accumulator & ExtensionFrom<Current>>
  : Accumulator

export type MiddlewareContext = {
    isDurableObject: true
    /**
     * @deprecated
     */
    state: DurableObjectState
  } | {
    isDurableObject: false
    /**
     * @deprecated
     */
    ctx: ExecutionContext
  }

class NextData<const T extends Record<string, unknown> = Record<never, never>> {
  // @ts-expect-error data could use better typing
  constructor(public data: T = {}) {}
}

type NextFn = <const T extends Record<string, unknown> = Record<never, never>>(data?: T) => NextData<T>

export const next: NextFn = (extension?: any) => new NextData(extension)

export function middleware<
  const Extension extends Record<string, unknown> = Record<never, never>
>(
  handler: (input: {
    event: Data & { reply: Reply; next: NextFn } & MiddlewareContext
    env: Environment
    ctx: ExecutionContext | DurableObjectState
    logger: Logger
  }) => MaybePromise<NextData<Extension> | Reply>
): Middleware<Extension extends Record<any, any> ? Extension : unknown>

export function middleware<
  const Requires extends MiddlewareList,
  const Replies extends Partial<Record<Status, ZodType>> | undefined = undefined,
  const Extension extends Record<string, unknown> = Record<never, never>
>(
  options: {
    name?: string
    requires?: Requires
    replies?: Replies
  },
  handler: (input: {
    event: Data & { reply: ReplyFrom<Replies>; next: NextFn; body: unknown } & MiddlewareContext & ExtensionsFrom<Requires>
    env: Environment
    ctx: ExecutionContext | DurableObjectState
    logger: Logger
  }) => MaybePromise<NextData<Extension> | Reply>
): Middleware<Extension extends Record<any, any> ? Extension : unknown>

export function middleware<
  const Requires extends MiddlewareList,
  const Replies extends Partial<Record<Status, ZodType>> | undefined = undefined,
  const Extension extends Record<string, unknown> = Record<never, never>
>(
  options:
    {
      name?: string
      requires?: Requires
      replies?: Replies
    }
    |
    ((input: {
      event: Data & { reply: Reply; next: NextFn; body: unknown } & MiddlewareContext
      env: Environment
      ctx: ExecutionContext | DurableObjectState
      logger: Logger
    }) => MaybePromise<NextData<Extension> | Reply>),
  handler?: (input: {
    event: Data & { reply: ReplyFrom<Replies>; next: NextFn; body: unknown } & MiddlewareContext & ExtensionsFrom<Requires>
    env: Environment
    ctx: ExecutionContext | DurableObjectState
    logger: Logger
  }) => MaybePromise<NextData<Extension> | Reply>
): Middleware<Extension extends Record<any, any> ? Extension : unknown> {
  const _options = typeof options === 'object' ? options : {}
  const _handler = typeof options === 'function' ? options : handler
  if (!_handler) throw new Error('[Comet] A middleware received no handler argument.')
  return {
    ..._options,
    handler: async input => {
      const nextData = await _handler(input)
      if (nextData instanceof NextData) Object.assign(input.event, nextData.data)
    }
  }
}
