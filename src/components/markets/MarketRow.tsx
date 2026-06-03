import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { PolymarketEvent, PolymarketMarket } from '../../types/polymarket'
import { formatVolume } from '../../lib/format'
import { getMarketPrices, getPrimaryYesPrice } from '../../lib/prices'
import { useSlip } from '../../context/SlipContext'
import { OddsButton } from './OddsButton'

export function MarketRow({
  event,
  market,
}: {
  event: PolymarketEvent
  market: PolymarketMarket
}) {
  const { addSelection, selections } = useSlip()
  const prices = getMarketPrices(market)
  const yesPrice = getPrimaryYesPrice(market)
  const title = market.groupItemTitle
    ? `${event.title} — ${market.groupItemTitle}`
    : market.question

  return (
    <article className="border-b border-border last:border-b-0">
      <div className="flex items-start gap-3 px-3 py-3 sm:px-4 hover:bg-neutral-50/80 transition-colors">
        {event.image && (
          <img
            src={event.image}
            alt=""
            className="size-10 rounded-md object-cover shrink-0 hidden sm:block"
            loading="lazy"
          />
        )}
        <div className="flex-1 min-w-0">
          <Link
            to={`/event/${event.slug}`}
            className="font-medium text-sm sm:text-[15px] leading-snug text-neutral-900 hover:text-brand line-clamp-2"
          >
            {title}
          </Link>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted">
            <span>Vol {formatVolume(market.volumeNum ?? event.volume24hr)}</span>
            {yesPrice > 0 && yesPrice < 1 && (
              <span className="text-brand font-medium">
                Yes {Math.round(yesPrice * 100)}%
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {prices.slice(0, 2).map(({ outcome, price }) => {
            const selected = selections.some(
              (s) => s.marketId === market.id && s.outcome === outcome,
            )
            return (
              <OddsButton
                key={outcome}
                label={outcome}
                price={price}
                selected={selected}
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
            )
          })}
          <Link
            to={`/event/${event.slug}`}
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
