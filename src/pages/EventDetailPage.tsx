import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Star } from 'lucide-react'
import { useHubEvent, useLivePrices } from '../hooks/useMarkets'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import { formatDate, formatVolume } from '../lib/format'
import { applyLivePrices } from '../api/clob'
import { useSlip } from '../context/SlipContext'
import { useWatchlist } from '../context/WatchlistContext'
import { OddsButton } from '../components/markets/OddsButton'
import { SourceBadge } from '../components/markets/SourceBadge'
import { buildSlipSelection } from '../lib/trading/selection'
import type { MarketSource } from '../types/market'

export function EventDetailPage({ legacyPolymarket }: { legacyPolymarket?: boolean }) {
  const { source: sourceParam, slug } = useParams<{ source?: string; slug?: string }>()

  const source: MarketSource = legacyPolymarket
    ? 'polymarket'
    : sourceParam === 'kalshi'
      ? 'kalshi'
      : 'polymarket'
  const marketSlug = slug ?? ''

  const { data: event, isLoading, isError } = useHubEvent(source, marketSlug)
  const { data: livePrices = {} } = useLivePrices(event ? [event] : undefined)
  const { addSelection, selections } = useSlip()
  const { isWatched, toggleWatch } = useWatchlist()

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    )
  }

  if (isError || !event) {
    return (
      <EmptyState
        title="Market not found"
        description="This event may be closed or unavailable."
      />
    )
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-brand font-medium hover:underline"
      >
        <ArrowLeft className="size-4" />
        Back to markets
      </Link>

      <article className="rounded-lg border border-border overflow-hidden bg-white dark:bg-neutral-900 shadow-sm">
        {event.image && (
          <img src={event.image} alt="" className="w-full h-40 sm:h-48 object-cover" />
        )}
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2">
            <SourceBadge source={event.source} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold leading-tight dark:text-neutral-100">
            {event.title}
          </h1>
          {event.description && (
            <p className="text-sm text-muted mt-3 leading-relaxed line-clamp-6">
              {event.description}
            </p>
          )}
          <dl className="flex flex-wrap gap-4 mt-4 text-sm">
            <div>
              <dt className="text-muted text-xs uppercase font-semibold">24h Vol</dt>
              <dd className="font-semibold dark:text-neutral-100">
                {formatVolume(event.volume24hr)}
              </dd>
            </div>
            <div>
              <dt className="text-muted text-xs uppercase font-semibold">Ends</dt>
              <dd className="font-semibold dark:text-neutral-100">{formatDate(event.endDate)}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs uppercase font-semibold">Markets</dt>
              <dd className="font-semibold dark:text-neutral-100">{event.markets.length}</dd>
            </div>
          </dl>
          <a
            href={event.markets[0]?.externalUrl ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-brand hover:underline"
          >
            Trade on {event.source === 'kalshi' ? 'Kalshi' : 'Polymarket'}
            <ExternalLink className="size-4" />
          </a>
        </div>
      </article>

      <section>
        <h2 className="font-bold text-lg mb-3 dark:text-neutral-100">Outcomes</h2>
        <div className="space-y-3">
          {event.markets.map((market) => {
            const outcomes = applyLivePrices(
              market.outcomes,
              market.clobTokenIds,
              livePrices,
            )
            const label = market.groupItemTitle ?? market.question
            return (
              <div
                key={market.id}
                className="p-4 rounded-lg border border-border bg-white dark:bg-neutral-900"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p className="font-medium text-sm sm:text-base dark:text-neutral-100">{label}</p>
                  <button
                    type="button"
                    onClick={() =>
                      toggleWatch({
                        source: event.source,
                        eventSlug: event.slug,
                        eventTitle: event.title,
                        marketId: market.id,
                      })
                    }
                    className="p-1 text-muted hover:text-amber-500 shrink-0"
                  >
                    <Star
                      className={`size-5 ${isWatched(market.id) ? 'fill-amber-400 text-amber-400' : ''}`}
                    />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {outcomes.map(({ outcome, price, live }) => (
                    <OddsButton
                      key={outcome}
                      label={outcome}
                      price={price}
                      live={live}
                      selected={selections.some(
                        (s) => s.marketId === market.id && s.outcome === outcome,
                      )}
                      onClick={() => {
                        const item = buildSlipSelection(event, market, outcome, price)
                        if (item) addSelection(item)
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted mt-2">
                  Vol {formatVolume(market.volumeNum ?? market.volume24hr)}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <p className="text-xs text-muted border border-dashed border-border rounded-lg p-3">
        Connect a Polygon wallet, add selections to the bet slip, and place limit orders on
        Polymarket. Kalshi markets open on kalshi.com.
      </p>
    </div>
  )
}
