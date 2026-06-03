import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useEvent } from '../hooks/usePolymarket'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import { formatDate, formatVolume } from '../lib/format'
import { getMarketPrices } from '../lib/prices'
import { useSlip } from '../context/SlipContext'
import { OddsButton } from '../components/markets/OddsButton'

export function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: event, isLoading, isError } = useEvent(slug)
  const { addSelection, selections } = useSlip()

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

      <article className="rounded-lg border border-border overflow-hidden bg-white shadow-sm">
        {event.image && (
          <img
            src={event.image}
            alt=""
            className="w-full h-40 sm:h-48 object-cover"
          />
        )}
        <div className="p-4 sm:p-5">
          <h1 className="text-xl sm:text-2xl font-bold leading-tight">
            {event.title}
          </h1>
          {event.description && (
            <p className="text-sm text-muted mt-3 leading-relaxed line-clamp-4">
              {event.description}
            </p>
          )}
          <dl className="flex flex-wrap gap-4 mt-4 text-sm">
            <div>
              <dt className="text-muted text-xs uppercase font-semibold">24h Vol</dt>
              <dd className="font-semibold">{formatVolume(event.volume24hr)}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs uppercase font-semibold">Ends</dt>
              <dd className="font-semibold">{formatDate(event.endDate)}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs uppercase font-semibold">Markets</dt>
              <dd className="font-semibold">{event.markets.length}</dd>
            </div>
          </dl>
          <a
            href={`https://polymarket.com/event/${event.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-brand hover:underline"
          >
            View on Polymarket
            <ExternalLink className="size-4" />
          </a>
        </div>
      </article>

      <section>
        <h2 className="font-bold text-lg mb-3">Outcomes</h2>
        <div className="space-y-3">
          {event.markets.map((market) => {
            const prices = getMarketPrices(market)
            const label = market.groupItemTitle ?? market.question
            return (
              <div
                key={market.id}
                className="p-4 rounded-lg border border-border bg-white"
              >
                <p className="font-medium text-sm sm:text-base mb-3">{label}</p>
                <div className="flex flex-wrap gap-2">
                  {prices.map(({ outcome, price }) => (
                    <OddsButton
                      key={outcome}
                      label={outcome}
                      price={price}
                      selected={selections.some(
                        (s) =>
                          s.marketId === market.id && s.outcome === outcome,
                      )}
                      onClick={() =>
                        addSelection({
                          eventId: event.id,
                          eventTitle: event.title,
                          marketId: market.id,
                          question: market.question,
                          outcome,
                          price,
                        })
                      }
                    />
                  ))}
                </div>
                <p className="text-xs text-muted mt-2">
                  Vol {formatVolume(market.volumeNum)}
                </p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
