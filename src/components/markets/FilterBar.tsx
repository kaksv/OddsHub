import { useFilters } from '../../context/FilterContext'
import type { MarketSource } from '../../types/market'

const SOURCES: { id: MarketSource; label: string }[] = [
  { id: 'polymarket', label: 'Polymarket' },
  { id: 'kalshi', label: 'Kalshi' },
]

export function FilterBar() {
  const { filters, setFilters } = useFilters()

  function toggleSource(source: MarketSource) {
    const next = filters.sources.includes(source)
      ? filters.sources.filter((s) => s !== source)
      : [...filters.sources, source]
    if (next.length) setFilters({ sources: next })
  }

  return (
    <div className="p-3 rounded-lg border border-border bg-white dark:bg-neutral-900 space-y-3 text-sm">
      <p className="font-semibold text-neutral-900 dark:text-neutral-100">Filters</p>

      <div className="flex flex-wrap gap-2">
        {SOURCES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => toggleSource(id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
              filters.sources.includes(id)
                ? 'bg-brand text-white border-brand'
                : 'border-border text-muted hover:border-brand'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="block">
        <span className="text-muted text-xs">Min 24h volume ($)</span>
        <input
          type="number"
          min={0}
          step={1000}
          value={filters.minVolume24h}
          onChange={(e) => setFilters({ minVolume24h: Number(e.target.value) || 0 })}
          className="mt-1 w-full h-9 px-2 rounded border border-border bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-100"
        />
      </label>

      <label className="block">
        <span className="text-muted text-xs">Min liquidity ($)</span>
        <input
          type="number"
          min={0}
          step={500}
          value={filters.minLiquidity}
          onChange={(e) => setFilters({ minLiquidity: Number(e.target.value) || 0 })}
          className="mt-1 w-full h-9 px-2 rounded border border-border bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-100"
        />
      </label>
    </div>
  )
}
