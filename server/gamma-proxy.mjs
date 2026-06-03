/**
 * Standalone Polymarket Gamma API proxy.
 * Browsers cannot call gamma-api.polymarket.com directly (no CORS).
 * Run via: node server/gamma-proxy.mjs
 */
import http from 'node:http'
import dns from 'node:dns'

const GAMMA_ORIGIN = 'https://gamma-api.polymarket.com'
const HOST = process.env.GAMMA_PROXY_HOST ?? '127.0.0.1'
const PORT = Number(process.env.GAMMA_PROXY_PORT ?? 8787)

// Prefer IPv4 — fixes connection issues on some networks
dns.setDefaultResultOrder('ipv4first')

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(JSON.stringify(body))
}

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    sendJson(res, 400, { error: 'Bad request' })
    return
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
    res.end()
    return
  }

  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed' })
    return
  }

  const url = new URL(req.url, `http://${HOST}:${PORT}`)
  const pathname = url.pathname

  if (pathname === '/health') {
    try {
      const ping = await fetch(`${GAMMA_ORIGIN}/events?limit=1`, {
        headers: { accept: 'application/json' },
      })
      sendJson(res, ping.ok ? 200 : 502, {
        ok: ping.ok,
        gamma: GAMMA_ORIGIN,
        status: ping.status,
      })
    } catch (err) {
      sendJson(res, 502, {
        ok: false,
        gamma: GAMMA_ORIGIN,
        error: err instanceof Error ? err.message : 'Unknown error',
      })
    }
    return
  }

  const gammaPath = pathname.startsWith('/api/gamma')
    ? pathname.slice('/api/gamma'.length) || '/'
    : pathname

  const target = `${GAMMA_ORIGIN}${gammaPath}${url.search}`

  try {
    const response = await fetch(target, {
      headers: { accept: 'application/json' },
    })
    const body = await response.text()
    res.writeHead(response.status, {
      'Content-Type': response.headers.get('content-type') ?? 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=30',
    })
    res.end(body)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Proxy error'
    console.error('[OddsHub proxy]', message, '→', target)
    sendJson(res, 502, { error: message })
  }
})

server.listen(PORT, HOST, () => {
  console.log(`[OddsHub] Polymarket proxy ready → http://${HOST}:${PORT}`)
  console.log(`[OddsHub] Health check → http://${HOST}:${PORT}/health`)
})
