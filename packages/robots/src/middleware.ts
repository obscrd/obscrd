export interface MiddlewareOptions {
  /** Block all AI crawlers */
  blockAll?: boolean
}

/**
 * Create middleware for Next.js / Express / Fastify
 */
export function createMiddleware(_options?: MiddlewareOptions) {
  // TODO: Implement framework-specific middleware
  throw new Error('Not yet implemented')
}
