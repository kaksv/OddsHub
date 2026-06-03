import type { PolymarketEvent } from '../../types/polymarket'
import { MarketRow } from './MarketRow'
import { EmptyState } from '../ui/EmptyState'
import { Spinner } from '../ui/Spinner'
import { RefreshCw } from 'lucide-react'

export function EventList({
  events,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  isRetrying,
  emptyTitle = 'No markets found',
}: {
  events: PolymarketEvent[] | undefined
  isLoading: boolean
  isError?: boolean
  errorMessage?: string
  onRetry?: () => void
  isRetrying?: boolean
  emptyTitle?: string
}) {
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
          description={
            errorMessage ??
            'Run npm run dev and ensure your network can reach polymarket.com.'
          }
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
        description="Try another category or search term."
      />
    )
  }

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
      {events.flatMap((event) =>
        event.markets.slice(0, 3).map((market) => (
          <MarketRow key={market.id} event={event} market={market} />
        )),
      )}
    </div>
  )
}
