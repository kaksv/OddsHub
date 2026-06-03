import { useMemo } from 'react'
import { useHubEvents } from '../hooks/useMarkets'
import { useWatchlist } from '../context/WatchlistContext'
import { EventList } from '../components/markets/EventList'
import { EmptyState } from '../components/ui/EmptyState'

export function FavoritesPage() {
  const { items } = useWatchlist()
  const { data: allEvents, isLoading } = useHubEvents({ limit: 80 })

  const favorites = useMemo(() => {
    if (!allEvents?.length || !items.length) return []
    const ids = new Set(items.map((i) => i.marketId))
    return allEvents
      .map((event) => ({
        ...event,
        markets: event.markets.filter((m) => ids.has(m.id)),
      }))
      .filter((e) => e.markets.length > 0)
  }, [allEvents, items])

  if (!items.length) {
    return (
      <EmptyState
        title="No favorites yet"
        description="Tap the star on any market row to save it here."
      />
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold dark:text-neutral-100">Watchlist</h1>
      <p className="text-sm text-muted">{items.length} saved market(s)</p>
      <EventList events={favorites} isLoading={isLoading} emptyTitle="Loading favorites…" />
    </div>
  )
}
