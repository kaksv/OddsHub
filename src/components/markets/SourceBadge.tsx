import type { MarketSource } from '../../types/market'

const STYLES: Record<MarketSource, string> = {
  polymarket: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200',
  kalshi: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200',
}

export function SourceBadge({ source }: { source: MarketSource }) {
  return (
    <span
      className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${STYLES[source]}`}
    >
      {source === 'polymarket' ? 'Poly' : 'Kalshi'}
    </span>
  )
}
