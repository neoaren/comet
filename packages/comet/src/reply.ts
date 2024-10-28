import { trace } from '@opentelemetry/api'
import { Cookies } from './cookies'
import { recordException } from './logger'
import type { Options } from './types'


export enum Status {
  Continue = 'continue',
  SwitchingProtocols = 'switchingProtocols',
  Processing = 'processing',
  Ok = 'ok',
  Created = 'created',
  Accepted = 'accepted',
  NonAuthoritativeInformation = 'nonAuthoritativeInformation',
  NoContent = 'noContent',
  ResetContent = 'resetContent',
  PartialContent = 'partialContent',
  MultiStatus = 'multiStatus',
  MultipleChoices = 'multipleChoices',
  MovedPermanently = 'movedPermanently',
  MovedTemporarily = 'movedTemporarily',
  SeeOther = 'seeOther',
  NotModified = 'notModified',
  UseProxy = 'useProxy',
  TemporaryRedirect = 'temporaryRedirect',
  PermanentRedirect = 'permanentRedirect',
  BadRequest = 'badRequest',
  Unauthorized = 'unauthorized',
  PaymentRequired = 'paymentRequired',
  Forbidden = 'forbidden',
  NotFound = 'notFound',
  MethodNotAllowed = 'methodNotAllowed',
  NotAcceptable = 'notAcceptable',
  ProxyAuthenticationRequired = 'proxyAuthenticationRequired',
  RequestTimeout = 'requestTimeout',
  Conflict = 'conflict',
  Gone = 'gone',
  LengthRequired = 'lengthRequired',
  PreconditionFailed = 'preconditionFailed',
  RequestTooLong = 'requestTooLong',
  RequestUriTooLong = 'requestUriTooLong',
  UnsupportedMediaType = 'unsupportedMediaType',
  RequestedRangeNotSatisfiable = 'requestedRangeNotSatisfiable',
  ExpectationFailed = 'expectationFailed',
  ImATeapot = 'imATeapot',
  InsufficientSpaceOnResource = 'insufficientSpaceOnResource',
  MethodFailure = 'methodFailure',
  MisdirectedRequest = 'misdirectedRequest',
  UnprocessableEntity = 'unprocessableEntity',
  FailedDependency = 'failedDependency',
  UpgradeRequired = 'upgradeRequired',
  PreconditionRequired = 'preconditionRequired',
  TooManyRequests = 'tooManyRequests',
  RequestHeaderFieldsTooLarge = 'requestHeaderFieldsTooLarge',
  UnavailableForLegalReasons = 'unavailableForLegalReasons',
  InternalServerError = 'internalServerError',
  NotImplemented = 'notImplemented',
  BadGateway = 'badGateway',
  ServiceUnavailable = 'serviceUnavailable',
  GatewayTimeout = 'gatewayTimeout',
  HttpVersionNotSupported = 'httpVersionNotSupported',
  InsufficientStorage = 'insufficientStorage',
  NetworkAuthenticationRequired = 'networkAuthenticationRequired'
}

// type BodyInit = unknown
type Bod = BodyInit | object | null | undefined

export class Reply<
  Status extends number = number,
  Body extends Bod = Bod
> {

  constructor(
    public status: Status,
    public body: Body,
    public headers: Headers,
    public cookies: Cookies
  ) {}

  // // Reply data for regular replies
  // public body: Body = null
  // public status: Status = 200
  // public headers = new Headers()
  // public cookies = new Cookies()

  // The date the reply was sent
  public sent?: Date

  // Convert a reply to a standard response
  static async toResponse(reply: Reply, options: Options): Promise<Response> {
    return new Response(null, { status: 200 })

    // // Return error response if no reply was sent
    // if (!reply.sent) {
    //   recordException('[Comet] No reply was sent for this event.')
    //   return new Response(null, { status: 500 })
    // }
    //
    // // Get status, headers and serialize cookies
    // const status = reply.status
    // const headers = reply.headers
    // await Cookies.serialize(reply.cookies, reply.headers, options.cookies)
    // // Handle websocket response
    // if (reply.body instanceof WebSocket) {
    //   trace.getActiveSpan()?.addEvent('return websocket response')
    //   return new Response(null, { status, headers, webSocket: reply.body })
    // }
    // // Handle stream response
    // if (reply.body instanceof ReadableStream) {
    //   trace.getActiveSpan()?.addEvent('return streamed response')
    //   return new Response(reply.body, { status, headers })
    // }
    //
    // if (reply.body instanceof ArrayBuffer) {
    //   trace.getActiveSpan()?.addEvent('return arraybuffer response')
    //
    //   return new Response(reply.body, { status, headers })
    // }
    //
    // if (reply.body instanceof Blob) {
    //   trace.getActiveSpan()?.addEvent('return blob response')
    //
    //   return new Response(reply.body, { status, headers })
    // }
    //
    // // Handle json response
    // let body: BodyInit | null = null
    // if (reply.body, this.headers, this.cookies) {
    //   if (!headers.has('content-type') || headers.get('content-type') === 'application/json') {
    //     headers.set('content-type', 'application/json')
    //     body = options.dev ? JSON.stringify(reply.body, null, 2) : JSON.stringify(reply.body, this.headers, this.cookies)
    //   } else {
    //     body = reply.body as BodyInit
    //   }
    // }
    // trace.getActiveSpan()?.addEvent('convert response')
    // return new Response(body, { status, headers })
  }

  // // Send a regular reply
  // private send<TStatus extends number, TBody extends unknown>(
  //   status: TStatus,
  //   body?: TBody | null | undefined
  // ): Reply {
  //   if (this.sent) {
  //     recordException('[Comet] Cannot send a reply after one has already been sent.')
  //     return this
  //   }
  //   this.status = status
  //   this.body = body
  //   this.sent = new Date()
  //   trace.getActiveSpan()?.addEvent('send reply', {
  //     status,
  //     sent: +this.sent
  //   })
  //   return this
  // }

}

export class ReplyFactory {

  // Reply headers
  public headers = new Headers()

  // Reply cookies
  public cookies = new Cookies()

  // Send an HTTP `100 Continue` informational response
  public continue<TBody extends Bod>(body?: TBody) {
    return new Reply(100, body, this.headers, this.cookies)
  }

  // Send an HTTP `101 Switching Protocols` informational response
  public switchingProtocols<TBody extends Bod>(body?: TBody) {
    return new Reply(101, body, this.headers, this.cookies)
  }

  // Send an HTTP `102 Processing` informational response
  public processing<TBody extends Bod>(body?: TBody) {
    return new Reply(102, body, this.headers, this.cookies)
  }

  // Send an HTTP `200 OK` successful response
  public ok<TBody extends Bod>(body?: TBody) {
    return new Reply(200, body, this.headers, this.cookies)
  }

  // Send an HTTP `201 Created` successful response
  public created<TBody extends Bod>(body?: TBody) {
    return new Reply(201, body, this.headers, this.cookies)
  }

  // Send an HTTP `202 Accepted` successful response
  public accepted<TBody extends Bod>(body?: TBody) {
    return new Reply(202, body, this.headers, this.cookies)
  }

  // Send an HTTP `203 Non-Authoritative Information` successful response
  public nonAuthoritativeInformation<TBody extends Bod>(body?: TBody) {
    return new Reply(203, body, this.headers, this.cookies)
  }

  // Send an HTTP `204 No Content` successful response
  public noContent<TBody extends Bod>(body?: TBody) {
    return new Reply(204, body, this.headers, this.cookies)
  }

  // Send an HTTP `205 Reset Content` successful response
  public resetContent<TBody extends Bod>(body?: TBody) {
    return new Reply(205, body, this.headers, this.cookies)
  }

  // Send an HTTP `206 Partial Content` successful response
  public partialContent<TBody extends Bod>(body?: TBody) {
    return new Reply(206, body, this.headers, this.cookies)
  }

  // Send an HTTP `207 Multi-Status` successful response
  public multiStatus<TBody extends Bod>(body?: TBody) {
    return new Reply(207, body, this.headers, this.cookies)
  }

  // Send an HTTP `300 Multiple Choices` redirection response
  public multipleChoices<TBody extends Bod>(body?: TBody) {
    return new Reply(300, body, this.headers, this.cookies)
  }

  // Send an HTTP `301 Moved Permanently` redirection response
  public movedPermanently<TBody extends Bod>(body?: TBody) {
    return new Reply(301, body, this.headers, this.cookies)
  }

  // Send an HTTP `302 Moved Temporarily` redirection response
  public movedTemporarily<TBody extends Bod>(body?: TBody) {
    return new Reply(302, body, this.headers, this.cookies)
  }

  // Send an HTTP `303 See Other` redirection response
  public seeOther<TBody extends Bod>(body?: TBody) {
    return new Reply(303, body, this.headers, this.cookies)
  }

  // Send an HTTP `304 Not Modified` redirection response
  public notModified<TBody extends Bod>(body?: TBody) {
    return new Reply(304, body, this.headers, this.cookies)
  }

  // Send an HTTP `305 Use Proxy` redirection response
  public useProxy<TBody extends Bod>(body?: TBody) {
    return new Reply(305, body, this.headers, this.cookies)
  }

  // Send an HTTP `307 Temporary Redirect` redirection response
  public temporaryRedirect<TBody extends Bod>(body?: TBody) {
    return new Reply(307, body, this.headers, this.cookies)
  }

  // Send an HTTP `308 Permanent Redirect` redirection response
  public permanentRedirect<TBody extends Bod>(body?: TBody) {
    return new Reply(308, body, this.headers, this.cookies)
  }

  // Send an HTTP `400 Bad Request` client error response
  public badRequest<TBody extends Bod>(body?: TBody) {
    return new Reply(400, body, this.headers, this.cookies)
  }

  // Send an HTTP `401 Unauthorized` client error response
  public unauthorized<TBody extends Bod>(body?: TBody) {
    return new Reply(401, body, this.headers, this.cookies)
  }

  // Send an HTTP `402 Payment Required` client error response
  public paymentRequired<TBody extends Bod>(body?: TBody) {
    return new Reply(402, body, this.headers, this.cookies)
  }

  // Send an HTTP `403 Forbidden` client error response
  public forbidden<TBody extends Bod>(body?: TBody) {
    return new Reply(403, body, this.headers, this.cookies)
  }

  // Send an HTTP `404 Not Found` client error response
  public notFound<TBody extends Bod>(body?: TBody) {
    return new Reply(404, body, this.headers, this.cookies)
  }

  // Send an HTTP `405 Method Not Allowed` client error response
  public methodNotAllowed<TBody extends Bod>(body?: TBody) {
    return new Reply(405, body, this.headers, this.cookies)
  }

  // Send an HTTP `406 Not Acceptable` client error response
  public notAcceptable<TBody extends Bod>(body?: TBody) {
    return new Reply(406, body, this.headers, this.cookies)
  }

  // Send an HTTP `407 Proxy Authentication Required` client error response
  public proxyAuthenticationRequired<TBody extends Bod>(body?: TBody) {
    return new Reply(407, body, this.headers, this.cookies)
  }

  // Send an HTTP `408 Request Timeout` client error response
  public requestTimeout<TBody extends Bod>(body?: TBody) {
    return new Reply(408, body, this.headers, this.cookies)
  }

  // Send an HTTP `409 Conflict` client error response
  public conflict<TBody extends Bod>(body?: TBody) {
    return new Reply(409, body, this.headers, this.cookies)
  }

  // Send an HTTP `410 Gone` client error response
  public gone<TBody extends Bod>(body?: TBody) {
    return new Reply(410, body, this.headers, this.cookies)
  }

  // Send an HTTP `411 Length Required` client error response
  public lengthRequired<TBody extends Bod>(body?: TBody) {
    return new Reply(411, body, this.headers, this.cookies)
  }

  // Send an HTTP `412 Precondition Failed` client error response
  public preconditionFailed<TBody extends Bod>(body?: TBody) {
    return new Reply(412, body, this.headers, this.cookies)
  }

  // Send an HTTP `413 Request Too Long` client error response
  public requestTooLong<TBody extends Bod>(body?: TBody) {
    return new Reply(413, body, this.headers, this.cookies)
  }

  // Send an HTTP `414 Request URI Too Long` client error response
  public requestUriTooLong<TBody extends Bod>(body?: TBody) {
    return new Reply(414, body, this.headers, this.cookies)
  }

  // Send an HTTP `415 Unsupported Media Type` client error response
  public unsupportedMediaType<TBody extends Bod>(body?: TBody) {
    return new Reply(415, body, this.headers, this.cookies)
  }

  // Send an HTTP `416 Requested Range Not Satisfiable` client error response
  public requestedRangeNotSatisfiable<TBody extends Bod>(body?: TBody) {
    return new Reply(416, body, this.headers, this.cookies)
  }

  // Send an HTTP `417 Expectation Failed` client error response
  public expectationFailed<TBody extends Bod>(body?: TBody) {
    return new Reply(417, body, this.headers, this.cookies)
  }

  // Send an HTTP `418 I'm a teapot` client error response
  public imATeapot<TBody extends Bod>(body?: TBody) {
    return new Reply(418, body, this.headers, this.cookies)
  }

  // Send an HTTP `419 Insufficient Space On Resource` client error response
  public insufficientSpaceOnResource<TBody extends Bod>(body?: TBody) {
    return new Reply(419, body, this.headers, this.cookies)
  }

  // Send an HTTP `420 Method Failure` client error response
  public methodFailure<TBody extends Bod>(body?: TBody) {
    return new Reply(420, body, this.headers, this.cookies)
  }

  // Send an HTTP `421 Misdirected Request` client error response
  public misdirectedRequest<TBody extends Bod>(body?: TBody) {
    return new Reply(421, body, this.headers, this.cookies)
  }

  // Send an HTTP `422 Unprocessable Entity` client error response
  public unprocessableEntity<TBody extends Bod>(body?: TBody) {
    return new Reply(422, body, this.headers, this.cookies)
  }

  // Send an HTTP `424 Failed Dependency` client error response
  public failedDependency<TBody extends Bod>(body?: TBody) {
    return new Reply(424, body, this.headers, this.cookies)
  }

  // Send an HTTP `426 Upgrade Required` client error response
  public upgradeRequired<TBody extends Bod>(body?: TBody) {
    return new Reply(426, body, this.headers, this.cookies)
  }

  // Send an HTTP `428 Precondition Required` client error response
  public preconditionRequired<TBody extends Bod>(body?: TBody) {
    return new Reply(428, body, this.headers, this.cookies)
  }

  // Send an HTTP `429 Too Many Requests` client error response
  public tooManyRequests<TBody extends Bod>(body?: TBody) {
    return new Reply(429, body, this.headers, this.cookies)
  }

  // Send an HTTP `431 Request Header Fields Too Large` client error response
  public requestHeaderFieldsTooLarge<TBody extends Bod>(body?: TBody) {
    return new Reply(431, body, this.headers, this.cookies)
  }

  // Send an HTTP `451 Unavailable For Legal Reasons` client error response
  public unavailableForLegalReasons<TBody extends Bod>(body?: TBody) {
    return new Reply(451, body, this.headers, this.cookies)
  }

  // Send an HTTP `500 Internal Server Error` server error response
  public internalServerError<TBody extends Bod>(body?: TBody) {
    return new Reply(500, body, this.headers, this.cookies)
  }

  // Send an HTTP `501 Not Implemented` server error response
  public notImplemented<TBody extends Bod>(body?: TBody) {
    return new Reply(501, body, this.headers, this.cookies)
  }

  // Send an HTTP `502 Bad Gateway` server error response
  public badGateway<TBody extends Bod>(body?: TBody) {
    return new Reply(502, body, this.headers, this.cookies)
  }

  // Send an HTTP `503 Service Unavailable` server error response
  public serviceUnavailable<TBody extends Bod>(body?: TBody) {
    return new Reply(503, body, this.headers, this.cookies)
  }

  // Send an HTTP `504 Gateway Timeout` server error response
  public gatewayTimeout<TBody extends Bod>(body?: TBody) {
    return new Reply(504, body, this.headers, this.cookies)
  }

  // Send an HTTP `505 Http Version Not Supported` server error response
  public httpVersionNotSupported<TBody extends Bod>(body?: TBody) {
    return new Reply(505, body, this.headers, this.cookies)
  }

  // Send an HTTP `507 Insufficient Storage` server error response
  public insufficientStorage<TBody extends Bod>(body?: TBody) {
    return new Reply(507, body, this.headers, this.cookies)
  }

  // Send an HTTP `511 Network Authentication Required` server error response
  public networkAuthenticationRequired<TBody extends Bod>(body?: TBody) {
    return new Reply(511, body, this.headers, this.cookies)
  }

}
