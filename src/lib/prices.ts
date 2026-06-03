export function parseJsonArray<T>(raw: string | undefined): T[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as T[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function getMarketPrices(market: {
  outcomes: string
  outcomePrices: string
}): { outcome: string; price: number }[] {
  const outcomes = parseJsonArray<string>(market.outcomes)
  const prices = parseJsonArray<string>(market.outcomePrices).map((p) =>
    Number.parseFloat(p),
  )

  return outcomes.map((outcome, i) => ({
    outcome,
    price: Number.isFinite(prices[i]) ? prices[i] : 0,
  }))
}

export function getPrimaryYesPrice(market: {
  outcomes: string
  outcomePrices: string
}): number {
  const rows = getMarketPrices(market)
  const yes = rows.find((r) => r.outcome.toLowerCase() === 'yes')
  return yes?.price ?? rows[0]?.price ?? 0
}

export function isTradableMarket(market: { active: boolean; closed: boolean }): boolean {
  return market.active && !market.closed
}
