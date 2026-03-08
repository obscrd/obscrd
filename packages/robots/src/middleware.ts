import { generateRobotsTxt, type RobotsOptions } from './generators'

// ── Loose types for framework compatibility ──

interface IncomingRequest {
  url?: string
  path?: string
}

interface OutgoingResponse {
  setHeader?(name: string, value: string): void
  end?(body: string): void
  writeHead?(status: number, headers?: Record<string, string>): void
}

export type MiddlewareHandler = (req: IncomingRequest, res: OutgoingResponse, next?: () => void) => void

/**
 * Create middleware that serves robots.txt at /robots.txt.
 * Works with Express, Fastify, and Node's raw http module.
 */
export function createMiddleware(options?: RobotsOptions): MiddlewareHandler {
  const body = generateRobotsTxt(options)

  return (req, res, next) => {
    const url = req.path ?? req.url
    if (url !== '/robots.txt') {
      next?.()
      return
    }

    if (res.setHeader) {
      res.setHeader('Content-Type', 'text/plain')
      res.end?.(body)
    } else if (res.writeHead) {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end?.(body)
    }
  }
}
