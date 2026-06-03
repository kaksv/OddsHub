import type { HubEvent } from '../../types/market'
import { MarketRow } from './MarketRow'
import { EmptyState } from '../ui/EmptyState'
import { Spinner } from '../ui/Spinner'
import { RefreshCw } from 'lucide-react'
import { useLivePrices } from '../../hooks/useMarkets'

export function EventList({
  events,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  isRetrying,
  emptyTitle = 'No markets found',
}: {
  events: HubEvent[] | undefined
  isLoading: boolean
  isError?: boolean
  errorMessage?: string
  onRetry?: () => void
  isRetrying?: boolean
  emptyTitle?: string
}) {
  const { data: livePrices = {} } = useLivePrices(events)

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <EmptyState
          title="Could not load markets"
          description={errorMessage ?? 'Check your connection and try again.'}
        />
        {onRetry && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onRetry}
              disabled={isRetrying}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-brand text-white text-sm font-semibold hover:bg-brand-dark disabled:opacity-60"
            >
              <RefreshCw className={`size-4 ${isRetrying ? 'animate-spin' : ''}`} />
              Retry
            </button>
          </div>
        )}
      </div>
    )
  }

  if (!events?.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description="Try another category, source, or lower your filter thresholds."
      />
    )
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg border border-border overflow-hidden shadow-sm">
      {events.flatMap((event) =>
        event.markets.slice(0, 3).map((market) => (
          <MarketRow
            key={`${event.source}-${market.id}`}
            event={event}
            market={market}
            livePrices={livePrices}
          />
        )),
      )}
    </div>
  )
}
