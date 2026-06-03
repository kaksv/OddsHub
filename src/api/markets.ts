import type { HubEvent, HomeFeed, MarketFilters, MarketSource } from '../types/market'
import { fetchPolymarketEvents, fetchPolymarketEventBySlug, searchPolymarket, fetchPolymarketPositions } from './sources/polymarket'
import { fetchKalshiEvents, fetchKalshiEventBySlug } from './sources/kalshi'
import { apiFetch } from './http'

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

export interface FetchMarketsParams {
  limit?: number
  tag_slug?: string
  feed?: HomeFeed
  filters?: MarketFilters
}

function applyFilters(events: HubEvent[], filters: MarketFilters): HubEvent[] {
  return events
    .filter((e) => filters.sources.includes(e.source))
    .map((event) => {
      const markets = event.markets.filter((m) => {
        const vol = m.volume24hr ?? m.volumeNum ?? event.volume24hr ?? 0
        const liq = m.liquidityNum ?? event.liquidity ?? 0
        return vol >= filters.minVolume24h && liq >= filters.minLiquidity
      })
      return { ...event, markets }
    })
    .filter((e) => e.markets.length > 0)
}

export async function fetchHubEvents(params: FetchMarketsParams = {}): Promise<HubEvent[]> {
  const filters = params.filters ?? {
    minVolume24h: 0,
    minLiquidity: 0,
    sources: ['polymarket', 'kalshi'],
  }

  const tasks: Promise<HubEvent[]>[] = []

  if (filters.sources.includes('polymarket')) {
    tasks.push(
      fetchPolymarketEvents({
        limit: params.limit,
        tag_slug: params.tag_slug,
        feed: params.feed,
      }),
    )
  }

  if (filters.sources.includes('kalshi') && !params.tag_slug) {
    tasks.push(fetchKalshiEvents(Math.min(params.limit ?? 30, 25)))
  }

  const batches = await Promise.allSettled(tasks)
  const merged: HubEvent[] = []

  for (const batch of batches) {
    if (batch.status === 'fulfilled') merged.push(...batch.value)
  }

  merged.sort((a, b) => (b.volume24hr ?? 0) - (a.volume24hr ?? 0))

  return applyFilters(merged, filters)
}

export async function fetchHubEvent(
  source: MarketSource,
  slug: string,
): Promise<HubEvent | null> {
  if (source === 'kalshi') return fetchKalshiEventBySlug(slug)
  return fetchPolymarketEventBySlug(slug)
}

export async function searchHubEvents(query: string, filters?: MarketFilters): Promise<HubEvent[]> {
  const poly = await searchPolymarket(query)
  return applyFilters(poly, filters ?? { minVolume24h: 0, minLiquidity: 0, sources: ['polymarket', 'kalshi'] })
}

export async function fetchPositions(wallet: string) {
  return fetchPolymarketPositions(wallet)
}

export async function checkProxyHealth(): Promise<{ ok: boolean; error?: string }> {
  const envProxy = import.meta.env.VITE_API_PROXY as string | undefined
  if (envProxy) {
    try {
      const res = await fetch(`${envProxy.replace(/\/$/, '')}/health`)
      const j = (await res.json()) as { ok?: boolean; error?: string }
      return j.ok ? { ok: true } : { ok: false, error: j.error }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : 'Proxy down' }
    }
  }

  try {
    await apiFetch<unknown>('gamma', '/events', { limit: 1, active: true, closed: false })
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unreachable' }
  }
}
