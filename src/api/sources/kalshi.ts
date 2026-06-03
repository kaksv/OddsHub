import { apiFetch } from '../http'
import type { HubEvent, HubMarket } from '../../types/market'

interface KalshiMarket {
  ticker: string
  title?: string
  subtitle?: string
  yes_bid_dollars?: string
  yes_ask_dollars?: string
  no_bid_dollars?: string
  volume_24h_fp?: string
  liquidity_dollars?: string
  close_time?: string
}

interface KalshiEvent {
  event_ticker: string
  title: string
  sub_title?: string
  markets?: KalshiMarket[]
}

function parseDollar(v: string | undefined): number {
  if (!v) return 0
  const n = Number.parseFloat(v)
  return Number.isFinite(n) ? n : 0
}

function toHubMarket(event: KalshiEvent, m: KalshiMarket): HubMarket {
  const yesMid =
    parseDollar(m.yes_bid_dollars) > 0
      ? (parseDollar(m.yes_bid_dollars) + parseDollar(m.yes_ask_dollars)) / 2
      : parseDollar(m.yes_ask_dollars)

  return {
    id: m.ticker,
    source: 'kalshi',
    question: m.subtitle ?? m.title ?? event.title,
    slug: m.ticker,
    eventSlug: event.event_ticker,
    eventTitle: event.title,
    volume24hr: parseDollar(m.volume_24h_fp),
    liquidityNum: parseDollar(m.liquidity_dollars),
    endDate: m.close_time,
    outcomes: [
      { outcome: 'Yes', price: yesMid },
      { outcome: 'No', price: yesMid > 0 ? 1 - yesMid : 0 },
    ],
    externalUrl: `https://kalshi.com/markets/${m.ticker}`,
  }
}

export async function fetchKalshiEvents(limit = 30): Promise<HubEvent[]> {
  const result = await apiFetch<{ events?: KalshiEvent[] }>('kalshi', '/events', {
    limit,
    status: 'open',
    with_nested_markets: true,
  })

  return (result.events ?? [])
    .map((event) => {
      const markets = (event.markets ?? [])
        .filter((m) => parseDollar(m.yes_bid_dollars) > 0 || parseDollar(m.yes_ask_dollars) > 0)
        .slice(0, 5)
        .map((m) => toHubMarket(event, m))

      return {
        id: `kalshi-${event.event_ticker}`,
        source: 'kalshi' as const,
        slug: event.event_ticker,
        title: event.title,
        description: event.sub_title,
        volume24hr: markets.reduce((s, m) => s + (m.volume24hr ?? 0), 0),
        markets,
      }
    })
    .filter((e) => e.markets.length > 0)
}

export async function fetchKalshiEventBySlug(ticker: string): Promise<HubEvent | null> {
  try {
    const event = await apiFetch<KalshiEvent>('kalshi', `/events/${encodeURIComponent(ticker)}`)
    const markets = (event.markets ?? []).map((m) => toHubMarket(event, m))
    if (!markets.length) return null
    return {
      id: `kalshi-${event.event_ticker}`,
      source: 'kalshi',
      slug: event.event_ticker,
      title: event.title,
      description: event.sub_title,
      markets,
    }
  } catch {
    return null
  }
}
