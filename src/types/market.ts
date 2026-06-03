export type MarketSource = 'polymarket' | 'kalshi'

export interface OutcomePrice {
  outcome: string
  price: number
}

export interface HubMarket {
  id: string
  source: MarketSource
  question: string
  slug: string
  eventSlug: string
  eventTitle: string
  groupItemTitle?: string
  volumeNum?: number
  liquidityNum?: number
  volume24hr?: number
  endDate?: string
  image?: string
  outcomes: OutcomePrice[]
  clobTokenIds?: string[]
  tickSize?: string
  negRisk?: boolean
  externalUrl: string
}

export interface HubEvent {
  id: string
  source: MarketSource
  slug: string
  title: string
  description?: string
  image?: string
  volume24hr?: number
  liquidity?: number
  endDate?: string
  markets: HubMarket[]
}

export type HomeFeed = 'trending' | 'volume'

export interface MarketFilters {
  minVolume24h: number
  minLiquidity: number
  sources: MarketSource[]
}

export const DEFAULT_FILTERS: MarketFilters = {
  minVolume24h: 0,
  minLiquidity: 0,
  sources: ['polymarket', 'kalshi'],
}
