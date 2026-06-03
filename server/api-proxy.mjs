/**
 * OddsHub API proxy — Gamma, CLOB, Data, Kalshi (no browser CORS).
 */
import http from 'node:http'
import dns from 'node:dns'

dns.setDefaultResultOrder('ipv4first')

const HOST = process.env.API_PROXY_HOST ?? '127.0.0.1'
const PORT = Number(process.env.API_PROXY_PORT ?? 8787)

const UPSTREAMS = [
  { prefix: '/api/gamma', origin: 'https://gamma-api.polymarket.com' },
  { prefix: '/api/clob', origin: 'https://clob.polymarket.com' },
  { prefix: '/api/data', origin: 'https://data-api.polymarket.com' },
  { prefix: '/api/kalshi', origin: 'https://api.elections.kalshi.com/trade-api/v2' },
]

function cors(res, status, headers = {}) {
  res.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    ...headers,
  })
}

function sendJson(res, status, body) {
  cors(res, status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}

function resolveTarget(pathname) {
  for (const { prefix, origin } of UPSTREAMS) {
    if (pathname.startsWith(prefix)) {
      const sub = pathname.slice(prefix.length) || '/'
      return `${origin}${sub}`
    }
  }
  return null
}

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    sendJson(res, 400, { error: 'Bad request' })
    return
  }

  if (req.method === 'OPTIONS') {
    cors(res, 204)
    res.end()
    return
  }

  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed' })
    return
  }

  const url = new URL(req.url, `http://${HOST}:${PORT}`)

  if (url.pathname === '/health') {
    try {
      const ping = await fetch(`${UPSTREAMS[0].origin}/events?limit=1`)
      sendJson(res, ping.ok ? 200 : 502, { ok: ping.ok, services: UPSTREAMS.map((u) => u.prefix) })
    } catch (err) {
      sendJson(res, 502, { ok: false, error: err instanceof Error ? err.message : 'Unknown' })
    }
    return
  }

  const originPath = resolveTarget(url.pathname)
  if (!originPath) {
    sendJson(res, 404, { error: 'Unknown API route' })
    return
  }

  const target = `${originPath}${url.search}`

  try {
    const response = await fetch(target, { headers: { accept: 'application/json' } })
    const body = await response.text()
    cors(res, response.status, {
      'Content-Type': response.headers.get('content-type') ?? 'application/json',
      'Cache-Control': 'public, max-age=15',
    })
    res.end(body)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Proxy error'
    console.error('[OddsHub proxy]', message, '→', target)
    sendJson(res, 502, { error: message })
  }
})

server.listen(PORT, HOST, () => {
  console.log(`[OddsHub] API proxy → http://${HOST}:${PORT}`)
  console.log(`[OddsHub] Routes: ${UPSTREAMS.map((u) => u.prefix).join(', ')}`)
})
