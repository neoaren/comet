import { trace } from '@opentelemetry/api'
import { Cookies } from './cookies'
import { Method, type Options } from './types'
import { CometError, ErrorType } from './error'


export class Data {

  private constructor(
    public readonly request: Request,
    public readonly method: Method,
    public readonly pathname: string,
    public readonly hostname: string,
    public readonly headers: Headers,
    public readonly cookies: Cookies,
    public query: unknown,
    public params: unknown,
    public readonly server: { name?: string }
  ) {}

  public static async fromRequest(request: Request, options: Options, serverName?: string): Promise<Data> {
    const url = new URL(request.url)

    trace.getActiveSpan()?.addEvent('convert request to data', {
      method: request.method,
      pathname: url.pathname,
      hostname: url.hostname,
      protocol: url.protocol,
      params: url.search
    })

    return new Data(
      request,
      request.method.toUpperCase() as Method,
      url.pathname,
      url.hostname.toLowerCase(),
      request.headers,
      await Cookies.parse(request.headers, options.cookies),
      Object.fromEntries(url.searchParams.entries()),
      {},
      { name: serverName }
    )
  }

  public static async parseRequestBody(request: Request): Promise<{ raw?: unknown; body: unknown }> {
      const contentType = request.headers.get('content-type')?.split(';')[0]
      trace.getActiveSpan()?.addEvent('parse request body', {
        contentType: request.headers.get('content-type') ?? undefined,
        parsedContentType: contentType
      })
      switch (contentType) {
        case 'application/json': {
          const text = await request.text()
          try {
            return { raw: text, body: JSON.parse(text) }
          } catch (error) {
            throw new CometError(ErrorType.InvalidJSON, error)
          }
        }
        case 'multipart/form-data': {
          const formData = await request.formData()
          const body: Record<string, string | File> = {}
          for (const [key, value] of formData.entries()) body[key] = value
          return { body }
        }
        case 'application/x-www-form-urlencoded': {
          const text = await request.text()
          const entries = text.split('&').map(x => x.split('=').map(decodeURIComponent))
          return { body: Object.fromEntries(entries) }
        }
        default:
          return { body: undefined }
      }
  }

}
