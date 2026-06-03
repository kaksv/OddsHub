import type { HubMarket } from '../../types/market'
import type { MarketSource } from '../../types/market'
import type { SlipSelection } from '../../context/SlipContext'

export function resolveTokenId(market: HubMarket, outcome: string): string | undefined {
  const index = market.outcomes.findIndex(
    (o) => o.outcome.toLowerCase() === outcome.toLowerCase(),
  )
  if (index < 0) return undefined
  return market.clobTokenIds?.[index]
}

export function buildSlipSelection(
  event: {
    id: string
    source: MarketSource
    slug: string
    title: string
  },
  market: HubMarket,
  outcome: string,
  price: number,
): SlipSelection | null {
  const tokenId =
    market.source === 'polymarket' ? resolveTokenId(market, outcome) : undefined

  return {
    source: event.source,
    eventId: event.id,
    eventTitle: event.title,
    marketId: market.id,
    question: market.question,
    outcome,
    price,
    tokenId,
    tickSize: market.tickSize ?? '0.01',
    negRisk: market.negRisk ?? false,
  }
}

export function canTradeSelection(s: SlipSelection): boolean {
  return s.source === 'polymarket' && Boolean(s.tokenId) && s.price > 0 && s.price < 1
}
