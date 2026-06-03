export function formatVolume(value: number | undefined | null): string {
  if (value == null || Number.isNaN(value)) return '—'
  const abs = Math.abs(value)
  if (abs >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
  return `$${value.toFixed(0)}`
}

export function formatPercent(price: number): string {
  const pct = Math.round(price * 100)
  return `${pct}¢`
}

export function formatOdds(price: number): string {
  if (price <= 0 || price >= 1) return '—'
  const decimal = 1 / price
  return decimal >= 10 ? decimal.toFixed(1) : decimal.toFixed(2)
}

export function formatDate(iso: string | undefined): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}
