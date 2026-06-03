export interface PolymarketTag {
  id: string
  label: string
  slug: string
}

export interface PolymarketMarket {
  id: string
  question: string
  slug: string
  conditionId?: string
  outcomes: string
  outcomePrices: string
  volume?: string
  volumeNum?: number
  volume24hr?: number
  liquidity?: string
  liquidityNum?: number
  active: boolean
  closed: boolean
  endDate?: string
  endDateIso?: string
  image?: string
  icon?: string
  description?: string
  groupItemTitle?: string
  bestBid?: number
  bestAsk?: number
  lastTradePrice?: number
  oneDayPriceChange?: number
}

export interface PolymarketEvent {
  id: string
  title: string
  slug: string
  description?: string
  image?: string
  icon?: string
  active: boolean
  closed: boolean
  volume?: number
  volume24hr?: number
  liquidity?: number
  endDate?: string
  tags?: PolymarketTag[]
  markets: PolymarketMarket[]
}

export interface SlipSelection {
  eventId: string
  eventTitle: string
  marketId: string
  question: string
  outcome: string
  price: number
}
