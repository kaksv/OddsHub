import { useState } from 'react'
import { X, Trash2, ExternalLink, Loader2 } from 'lucide-react'
import { useSlip } from '../../context/SlipContext'
import { formatPercent } from '../../lib/format'
import { useWallet } from '../../hooks/useWallet'
import { usePlaceOrders } from '../../hooks/useTrade'
import { canTradeSelection } from '../../lib/trading/selection'
import { ConnectButton } from '../wallet/ConnectButton'
import { isWalletConfigured } from '../../config/wallet'

export function BetSlip() {
  const { selections, removeSelection, clearSlip, isOpen, setIsOpen, count } = useSlip()
  const { isConnected, isPolygon } = useWallet()
  const placeOrders = usePlaceOrders()
  const [stake, setStake] = useState('5')
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const tradableCount = selections.filter(canTradeSelection).length
  const hasKalshi = selections.some((s) => s.source === 'kalshi')
  const stakeNum = Number.parseFloat(stake) || 0
  const estTotal = tradableCount * stakeNum

  async function handlePlace() {
    setSuccessMsg(null)
    try {
      const results = await placeOrders.mutateAsync(stakeNum)
      setSuccessMsg(`Placed ${results.length} order(s) on Polymarket.`)
      clearSlip()
    } catch {
      /* error shown below */
    }
  }

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
          w-full sm:w-80 xl:w-72 shrink-0 bg-white dark:bg-neutral-900 border-l border-border shadow-xl xl:shadow-none
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
              Tap <strong>Yes</strong> or <strong>No</strong> on a Polymarket market, connect
              your wallet, and place a limit order here.
            </p>
          ) : (
            <ul className="space-y-3">
              {selections.map((s) => (
                <li
                  key={`${s.marketId}-${s.outcome}`}
                  className="p-3 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-800"
                >
                  <div className="flex justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs text-muted line-clamp-1">{s.eventTitle}</p>
                      <p className="text-sm font-medium mt-0.5 line-clamp-2">{s.question}</p>
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
                    <span className="text-sm font-semibold">{formatPercent(s.price)}</span>
                  </div>
                  {s.source === 'kalshi' && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
                      Kalshi — trade on kalshi.com
                    </p>
                  )}
                  {s.source === 'polymarket' && !canTradeSelection(s) && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
                      Missing token — re-add from market list
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-3 border-t border-border space-y-3">
          {selections.length > 0 && tradableCount > 0 && (
            <>
              <label className="block text-sm">
                <span className="text-muted text-xs font-medium">Stake per order (USDC ≈)</span>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  className="mt-1 w-full h-10 px-3 rounded-md border border-border bg-white dark:bg-neutral-800 dark:text-neutral-100 text-sm font-semibold"
                />
              </label>
              {tradableCount > 1 && (
                <p className="text-xs text-muted">
                  Est. total ≈ ${estTotal.toFixed(2)} ({tradableCount} Polymarket orders)
                </p>
              )}
            </>
          )}

          {!isConnected && isWalletConfigured && tradableCount > 0 && (
            <div className="flex flex-col items-center gap-2 py-1">
              <p className="text-xs text-muted text-center">Connect wallet to place orders</p>
              <ConnectButton />
            </div>
          )}

          {isConnected && !isPolygon && tradableCount > 0 && (
            <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 rounded-md p-2">
              Switch to Polygon when placing — we&apos;ll prompt your wallet.
            </p>
          )}

          {successMsg && (
            <p className="text-xs text-brand bg-brand-light dark:bg-brand/10 rounded-md p-2 font-medium">
              {successMsg}
            </p>
          )}

          {placeOrders.isError && (
            <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-md p-2">
              {placeOrders.error instanceof Error
                ? placeOrders.error.message
                : 'Order failed'}
            </p>
          )}

          {tradableCount > 0 ? (
            <button
              type="button"
              disabled={!isConnected || placeOrders.isPending || stakeNum < 1}
              onClick={handlePlace}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-md bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
            >
              {placeOrders.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Placing…
                </>
              ) : (
                `Place ${tradableCount} order${tradableCount > 1 ? 's' : ''} on Polymarket`
              )}
            </button>
          ) : hasKalshi && selections.length > 0 ? (
            <a
              href="https://kalshi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-md bg-brand hover:bg-brand-dark text-white font-semibold text-sm transition-colors"
            >
              Trade on Kalshi
              <ExternalLink className="size-4" />
            </a>
          ) : selections.length > 0 ? (
            <a
              href="https://polymarket.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-md border border-border text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Open Polymarket
              <ExternalLink className="size-4" />
            </a>
          ) : null}

          <p className="text-[10px] text-center text-muted leading-snug">
            Limit orders on Polygon. EOA wallets (MetaMask). Proxy/Safe Polymarket accounts may
            need polymarket.com. Not available in restricted regions.
          </p>
        </div>
      </aside>
    </>
  )
}
