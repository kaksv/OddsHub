import type { Connect, Plugin } from 'vite'

const GAMMA_ORIGIN = 'https://gamma-api.polymarket.com'
const PREFIX = '/api/gamma'

/**
 * Fallback in-process proxy when the standalone server (server/gamma-proxy.mjs) is not running.
 * Registered with enforce: 'pre' so it runs before SPA fallback.
 */
function createProxy(): Connect.NextHandleFunction {
  return async (req, res, next) => {
    if (!req.url?.startsWith(PREFIX)) {
      next()
      return
    }

    const pathAndQuery = req.url.slice(PREFIX.length) || '/'
    const target = `${GAMMA_ORIGIN}${pathAndQuery}`

    try {
      const response = await fetch(target, {
        headers: { accept: 'application/json' },
      })
      const body = await response.text()
      res.statusCode = response.status
      res.setHeader('Content-Type', response.headers.get('content-type') ?? 'application/json')
      res.setHeader('Cache-Control', 'public, max-age=30')
      res.end(body)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Proxy error'
      console.error('[OddsHub] In-process proxy failed:', message)
      console.error('[OddsHub] Start the dedicated proxy: node server/gamma-proxy.mjs')
      res.statusCode = 502
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: message }))
    }
  }
}

export function polymarketApiProxy(): Plugin {
  const handler = createProxy()
  return {
    name: 'oddshub-polymarket-proxy',
    enforce: 'pre',
    configureServer(server) {
      server.middlewares.use(handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    },
  }
}
