import { X, Trash2, ExternalLink } from 'lucide-react'
import { useSlip } from '../../context/SlipContext'
import { formatPercent } from '../../lib/format'

export function BetSlip() {
  const { selections, removeSelection, clearSlip, isOpen, setIsOpen, count } =
    useSlip()

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 z-50 xl:hidden"
          aria-label="Close slip"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside
        className={`
          fixed xl:sticky top-12 sm:top-14 xl:top-0 right-0 z-50 xl:z-0
          h-[calc(100dvh-3rem)] sm:h-[calc(100dvh-3.5rem)] xl:h-[calc(100dvh-3.5rem)]
          w-full sm:w-80 xl:w-72 shrink-0 bg-white border-l border-border shadow-xl xl:shadow-none
          flex flex-col transform transition-transform duration-200
          ${isOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-brand text-white">
          <h2 className="font-bold text-base">Bet Slip</h2>
          <div className="flex items-center gap-1">
            {count > 0 && (
              <button
                type="button"
                onClick={clearSlip}
                className="p-2 rounded hover:bg-white/15"
                aria-label="Clear slip"
              >
                <Trash2 className="size-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 rounded hover:bg-white/15 xl:hidden"
              aria-label="Close slip"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {selections.length === 0 ? (
            <p className="text-sm text-muted text-center py-12 px-4">
              Tap <strong>Yes</strong> or <strong>No</strong> on any market to add selections.
              Trading opens on Polymarket.
            </p>
          ) : (
            <ul className="space-y-3">
              {selections.map((s) => (
                <li
                  key={`${s.marketId}-${s.outcome}`}
                  className="p-3 rounded-lg border border-border bg-neutral-50"
                >
                  <div className="flex justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs text-muted line-clamp-1">{s.eventTitle}</p>
                      <p className="text-sm font-medium mt-0.5 line-clamp-2">
                        {s.question}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSelection(s.marketId, s.outcome)}
                      className="shrink-0 p-1 text-muted hover:text-red-600"
                      aria-label="Remove"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-brand">{s.outcome}</span>
                    <span className="text-sm font-semibold">
                      {formatPercent(s.price)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-3 border-t border-border space-y-2">
          <a
            href="https://polymarket.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-md bg-brand hover:bg-brand-dark text-white font-semibold text-sm transition-colors"
          >
            Trade on Polymarket
            <ExternalLink className="size-4" />
          </a>
          <p className="text-[10px] text-center text-muted leading-snug">
            Demo slip — no real wagers on OddsHub
          </p>
        </div>
      </aside>
    </>
  )
}
