import { apiFetch } from './http'

export async function fetchMidpoints(tokenIds: string[]): Promise<Record<string, number>> {
  const unique = [...new Set(tokenIds)].filter(Boolean).slice(0, 40)
  if (!unique.length) return {}

  const results = await Promise.all(
    unique.map(async (tokenId) => {
      try {
        const data = await apiFetch<{ mid?: string }>('clob', '/midpoint', { token_id: tokenId })
        const mid = Number.parseFloat(data.mid ?? '')
        return [tokenId, Number.isFinite(mid) ? mid : null] as const
      } catch {
        return [tokenId, null] as const
      }
    }),
  )

  const map: Record<string, number> = {}
  for (const [id, price] of results) {
    if (price != null) map[id] = price
  }
  return map
}

export function applyLivePrices(
  outcomes: { outcome: string; price: number }[],
  clobTokenIds: string[] | undefined,
  live: Record<string, number>,
): { outcome: string; price: number; live?: boolean }[] {
  if (!clobTokenIds?.length) return outcomes

  return outcomes.map((o, i) => {
    const tokenId = clobTokenIds[i]
    const livePrice = tokenId ? live[tokenId] : undefined
    if (livePrice == null) return o
    return { ...o, price: livePrice, live: true }
  })
}
