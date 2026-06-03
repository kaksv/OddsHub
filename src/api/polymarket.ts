import type { PolymarketEvent, PolymarketTag } from '../types/polymarket'
import { isTradableMarket } from '../lib/prices'

/** Same-origin path (via Vite proxy) or direct local proxy from .env.development */
function getApiBases(): string[] {
  const envProxy = import.meta.env.VITE_GAMMA_PROXY as string | undefined
  const bases = ['/api/gamma']
  if (envProxy) {
    bases.unshift(envProxy.replace(/\/$/, ''))
  }
  return [...new Set(bases)]
}

async function gammaFetch<T>(path: string, params?: Record<string, string | number | boolean>): Promise<T> {
  const searchParams = new URLSearchParams()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        searchParams.set(key, String(value))
      }
    }
  }
  const qs = searchParams.toString()
  const suffix = `${path}${qs ? `?${qs}` : ''}`

  let lastError: Error | null = null

  for (const base of getApiBases()) {
    const url = `${base}${suffix}`
    try {
      const res = await fetch(url)
      const text = await res.text()
      let data: T | { error?: string }
      try {
        data = JSON.parse(text) as T | { error?: string }
      } catch {
        lastError = new Error(`Invalid JSON from API (${res.status})`)
        continue
      }

      if (!res.ok) {
        const msg =
          data && typeof data === 'object' && 'error' in data
            ? String((data as { error: string }).error)
            : `Polymarket API error: ${res.status}`
        lastError = new Error(msg)
        continue
      }

      if (data && typeof data === 'object' && 'error' in data && !Array.isArray(data)) {
        lastError = new Error(String((data as { error: string }).error))
        continue
      }

      return data as T
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
    }
  }

  throw (
    lastError ??
    new Error(
      'Polymarket API proxy failed. Run: npm run dev (starts the proxy automatically).',
    )
  )
}

export async function checkProxyHealth(): Promise<{ ok: boolean; error?: string }> {
  for (const base of getApiBases()) {
    if (!base.startsWith('http')) continue
    try {
      const res = await fetch(`${base}/health`)
      const j = (await res.json()) as { ok?: boolean; error?: string }
      if (j.ok) return { ok: true }
      return { ok: false, error: j.error ?? `Proxy unhealthy (${res.status})` }
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : 'Local proxy not running',
      }
    }
  }

  try {
    await gammaFetch<unknown>('/events', { limit: 1, active: true, closed: false })
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Proxy unreachable',
    }
  }
}

function normalizeEventsResponse(raw: unknown): PolymarketEvent[] {
  if (Array.isArray(raw)) return raw as PolymarketEvent[]
  if (raw && typeof raw === 'object' && 'events' in raw) {
    const events = (raw as { events: PolymarketEvent[] }).events
    return Array.isArray(events) ? events : []
  }
  return []
}

export interface FetchEventsParams {
  limit?: number
  offset?: number
  tag_slug?: string
  order?: string
  ascending?: boolean
}

export async function fetchEvents(params: FetchEventsParams = {}): Promise<PolymarketEvent[]> {
  const query = {
    active: true,
    closed: false,
    limit: params.limit ?? 40,
    offset: params.offset ?? 0,
    order: params.order ?? 'volume_24hr',
    ascending: params.ascending ?? false,
    ...(params.tag_slug ? { tag_slug: params.tag_slug } : {}),
  }

  let events: PolymarketEvent[] = []

  try {
    const raw = await gammaFetch<unknown>('/events', query)
    events = normalizeEventsResponse(raw)
  } catch (e) {
    if (events.length === 0) throw e
  }

  if (events.length === 0) {
    try {
      const keyset = await gammaFetch<{ events?: PolymarketEvent[] }>('/events/keyset', query)
      events = keyset.events ?? []
    } catch {
      /* keep empty */
    }
  }

  const enriched = events.map(enrichEvent).filter((e) => e.markets.length > 0)
  if (enriched.length === 0 && events.length > 0) {
    throw new Error('Markets loaded but none are currently tradable.')
  }
  return enriched
}

export async function fetchEventBySlug(slug: string): Promise<PolymarketEvent | null> {
  try {
    const raw = await gammaFetch<unknown>('/events/slug/' + encodeURIComponent(slug))
    const single = raw as PolymarketEvent
    if (single?.id) return enrichEvent(single)
  } catch {
    /* fall through */
  }

  const raw = await gammaFetch<unknown>('/events', {
    slug,
    active: true,
    closed: false,
  })
  const events = normalizeEventsResponse(raw)
  const event = events[0]
  return event ? enrichEvent(event) : null
}

export async function fetchTags(): Promise<PolymarketTag[]> {
  const tags = await gammaFetch<PolymarketTag[]>('/tags', { limit: 50 })
  return Array.isArray(tags) ? tags.filter((t) => t.slug && t.label) : []
}

export async function searchMarkets(query: string): Promise<PolymarketEvent[]> {
  if (!query.trim()) return []

  const result = await gammaFetch<{
    events?: PolymarketEvent[]
  }>('/public-search', {
    q: query.trim(),
    limit_per_type: 20,
    search_tags: false,
    search_profiles: false,
  })

  const events = result.events ?? []
  return events.map(enrichEvent).filter((e) => e.markets.length > 0)
}

function enrichEvent(event: PolymarketEvent): PolymarketEvent {
  const markets = (event.markets ?? []).filter(isTradableMarket)
  return { ...event, markets }
}

/** Curated sidebar categories mapped to Polymarket tag slugs */
export const CATEGORIES = [
  { label: 'Popular', slug: '' },
  { label: 'Politics', slug: 'politics' },
  { label: 'Sports', slug: 'sports' },
  { label: 'Crypto', slug: 'crypto' },
  { label: 'Business', slug: 'business' },
  { label: 'Science', slug: 'science' },
  { label: 'Culture', slug: 'pop-culture' },
  { label: 'Tech', slug: 'tech' },
] as const
