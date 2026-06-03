interface Req {
  method?: string
  url?: string
  query: Record<string, string | string[] | undefined>
}

interface Res {
  status: (code: number) => Res
  setHeader: (key: string, value: string) => void
  end: (body?: string) => void
}

export function runProxy(
  req: Req,
  res: Res,
  origin: string,
  pathParam: string | string[] | undefined,
) {
  if (req.method === 'OPTIONS') {
    res.status(204)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.end('')
    return
  }

  const parts = pathParam
  const segments = Array.isArray(parts) ? parts : parts ? [parts] : []
  const subPath = segments.length ? `/${segments.join('/')}` : '/'

  const qs = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
  const target = `${origin}${subPath}${qs}`

  fetch(target, { headers: { accept: 'application/json' } })
    .then(async (response) => {
      const body = await response.text()
      res.status(response.status)
      res.setHeader('Content-Type', response.headers.get('content-type') ?? 'application/json')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Cache-Control', 'public, max-age=15')
      res.end(body)
    })
    .catch((err: Error) => {
      res.status(502)
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.end(JSON.stringify({ error: err.message }))
    })
}
