import { Link } from 'react-router-dom'
import { ChevronRight, Star } from 'lucide-react'
import type { HubEvent, HubMarket } from '../../types/market'
import { formatVolume } from '../../lib/format'
import { applyLivePrices } from '../../api/clob'
import { buildSlipSelection } from '../../lib/trading/selection'
import { useSlip } from '../../context/SlipContext'
import { useWatchlist } from '../../context/WatchlistContext'
import { OddsButton } from './OddsButton'
import { SourceBadge } from './SourceBadge'

export function MarketRow({
  event,
  market,
  livePrices = {},
}: {
  event: HubEvent
  market: HubMarket
  livePrices?: Record<string, number>
}) {
  const { addSelection, selections } = useSlip()
  const { isWatched, toggleWatch } = useWatchlist()

  const outcomes = applyLivePrices(market.outcomes, market.clobTokenIds, livePrices)
  const yes = outcomes.find((o) => o.outcome.toLowerCase() === 'yes')
  const title = market.groupItemTitle
    ? `${event.title} — ${market.groupItemTitle}`
    : market.question

  const detailPath = `/event/${event.source}/${event.slug}`

  return (
    <article className="border-b border-border last:border-b-0">
      <div className="flex items-start gap-3 px-3 py-3 sm:px-4 hover:bg-neutral-50/80 dark:hover:bg-neutral-800/50 transition-colors">
        {event.image && (
          <img
            src={event.image}
            alt=""
            className="size-10 rounded-md object-cover shrink-0 hidden sm:block"
            loading="lazy"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <SourceBadge source={event.source} />
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
              className="p-0.5 text-muted hover:text-amber-500"
              aria-label={isWatched(market.id) ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              <Star
                className={`size-4 ${isWatched(market.id) ? 'fill-amber-400 text-amber-400' : ''}`}
              />
            </button>
          </div>
          <Link
            to={detailPath}
            className="font-medium text-sm sm:text-[15px] leading-snug text-neutral-900 dark:text-neutral-100 hover:text-brand line-clamp-2"
          >
            {title}
          </Link>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted">
            <span>Vol {formatVolume(market.volumeNum ?? market.volume24hr ?? event.volume24hr)}</span>
            {yes && yes.price > 0 && yes.price < 1 && (
              <span className="text-brand font-medium">
                Yes {Math.round(yes.price * 100)}%
                {yes.live && <span className="text-emerald-600 dark:text-emerald-400"> live</span>}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {outcomes.slice(0, 2).map(({ outcome, price, live }) => {
            const selected = selections.some(
              (s) => s.marketId === market.id && s.outcome === outcome,
            )
            return (
              <OddsButton
                key={outcome}
                label={outcome}
                price={price}
                live={live}
                selected={selected}
                onClick={() => {
                  const item = buildSlipSelection(event, market, outcome, price)
                  if (item) addSelection(item)
                }}
              />
            )
          })}
          <Link
            to={detailPath}
            className="p-1.5 text-muted hover:text-brand"
            aria-label="View market details"
          >
            <ChevronRight className="size-5" />
          </Link>
        </div>
      </div>
    </article>
  )
}
