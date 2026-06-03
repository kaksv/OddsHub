import { apiFetch } from '../http'
import type { HubEvent, HubMarket, HomeFeed } from '../../types/market'
import type { PolymarketEvent, PolymarketMarket } from '../../types/polymarket'
import { isTradableMarket, parseJsonArray } from '../../lib/prices'

function toHubMarket(event: PolymarketEvent, market: PolymarketMarket): HubMarket {
  const outcomes = parseJsonArray<string>(market.outcomes)
  const prices = parseJsonArray<string>(market.outcomePrices).map(Number.parseFloat)
  const clobTokenIds = parseJsonArray<string>(market.clobTokenIds)

  return {
    id: market.id,
    source: 'polymarket',
    question: market.question,
    slug: market.slug,
    eventSlug: event.slug,
    eventTitle: event.title,
    groupItemTitle: market.groupItemTitle,
    volumeNum: market.volumeNum,
    liquidityNum: market.liquidityNum,
    volume24hr: event.volume24hr,
    endDate: market.endDate ?? event.endDate,
    image: market.image ?? event.image,
    outcomes: outcomes.map((outcome, i) => ({
      outcome,
      price: Number.isFinite(prices[i]) ? prices[i] : 0,
    })),
    clobTokenIds,
    tickSize: market.orderPriceMinTickSize
      ? String(market.orderPriceMinTickSize)
      : '0.01',
    negRisk: market.negRisk ?? false,
    externalUrl: `https://polymarket.com/event/${event.slug}`,
  }
}

function enrichEvent(event: PolymarketEvent): HubEvent {
  const markets = (event.markets ?? []).filter(isTradableMarket).map((m) => toHubMarket(event, m))
  return {
    id: event.id,
    source: 'polymarket',
    slug: event.slug,
    title: event.title,
    description: event.description,
    image: event.image,
    volume24hr: event.volume24hr,
    liquidity: event.liquidity,
    endDate: event.endDate,
    markets,
  }
}

function normalizeEvents(raw: unknown): PolymarketEvent[] {
  if (Array.isArray(raw)) return raw as PolymarketEvent[]
  if (raw && typeof raw === 'object' && 'events' in raw) {
    const events = (raw as { events: PolymarketEvent[] }).events
    return Array.isArray(events) ? events : []
  }
  return []
}

export interface PolymarketQuery {
  limit?: number
  offset?: number
  tag_slug?: string
  feed?: HomeFeed
}

export async function fetchPolymarketEvents(query: PolymarketQuery = {}): Promise<HubEvent[]> {
  const order = query.feed === 'volume' ? 'volume' : 'volume_24hr'
  const params = {
    active: true,
    closed: false,
    limit: query.limit ?? 40,
    offset: query.offset ?? 0,
    order,
    ascending: false,
    ...(query.tag_slug ? { tag_slug: query.tag_slug } : {}),
  }

  let raw: unknown
  try {
    raw = await apiFetch<unknown>('gamma', '/events', params)
  } catch {
    raw = await apiFetch<{ events?: PolymarketEvent[] }>('gamma', '/events/keyset', params)
  }

  const events = normalizeEvents(raw)
  return events.map(enrichEvent).filter((e) => e.markets.length > 0)
}

export async function fetchPolymarketEventBySlug(slug: string): Promise<HubEvent | null> {
  try {
    const single = await apiFetch<PolymarketEvent>('gamma', `/events/slug/${encodeURIComponent(slug)}`)
    if (single?.id) return enrichEvent(single)
  } catch {
    /* fallback */
  }

  const raw = await apiFetch<unknown>('gamma', '/events', { slug, active: true, closed: false })
  const event = normalizeEvents(raw)[0]
  return event ? enrichEvent(event) : null
}

export async function searchPolymarket(query: string): Promise<HubEvent[]> {
  const result = await apiFetch<{ events?: PolymarketEvent[] }>('gamma', '/public-search', {
    q: query.trim(),
    limit_per_type: 20,
    search_tags: false,
    search_profiles: false,
  })
  return (result.events ?? []).map(enrichEvent).filter((e) => e.markets.length > 0)
}

export async function fetchPolymarketPositions(wallet: string) {
  return apiFetch<unknown[]>('data', '/positions', { user: wallet, limit: 50 })
}
