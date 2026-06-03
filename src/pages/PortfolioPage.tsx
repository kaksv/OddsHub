import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Wallet, AlertTriangle } from 'lucide-react'
import { usePositions } from '../hooks/useMarkets'
import { useWallet } from '../hooks/useWallet'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import { formatVolume } from '../lib/format'
import { isWalletConfigured } from '../config/wallet'
import { ConnectButton } from '../components/wallet/ConnectButton'

const WALLET_KEY = 'oddshub-wallet'

export function PortfolioPage() {
  const { address, isConnected, isPolygon, shortAddress } = useWallet()
  const [manualWallet, setManualWallet] = useState(() => localStorage.getItem(WALLET_KEY) ?? '')
  const [input, setInput] = useState(manualWallet)

  const activeWallet = isConnected && address ? address : manualWallet
  const { data, isLoading, isError } = usePositions(
    activeWallet.match(/^0x[a-fA-F0-9]{40}$/) ? activeWallet : undefined,
  )

  function handleSaveManual(e: FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    setManualWallet(trimmed)
    localStorage.setItem(WALLET_KEY, trimmed)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="text-xl font-bold dark:text-neutral-100">Portfolio</h1>

      {isWalletConfigured ? (
        <section className="p-4 rounded-lg border border-border bg-white dark:bg-neutral-900 space-y-3">
          <p className="text-sm text-muted">
            Connect a Polygon wallet to load your Polymarket positions automatically.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <ConnectButton />
            {isConnected && address && (
              <div className="text-sm">
                <span className="font-mono font-medium dark:text-neutral-100">{shortAddress}</span>
                {!isPolygon && (
                  <span className="ml-2 text-amber-600 dark:text-amber-400 text-xs">
                    Switch to Polygon
                  </span>
                )}
              </div>
            )}
          </div>
        </section>
      ) : (
        <p className="text-sm text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          Add <code className="text-xs">VITE_REOWN_PROJECT_ID</code> to{' '}
          <code className="text-xs">.env.development</code> (free at{' '}
          <a href="https://dashboard.reown.com" className="underline" target="_blank" rel="noreferrer">
            cloud.reown.com
          </a>
          ) to enable wallet connect.
        </p>
      )}

      {!isConnected && (
        <>
          <p className="text-sm text-muted">Or paste any Polygon address (read-only):</p>
          <form onSubmit={handleSaveManual} className="flex gap-2">
            <div className="relative flex-1">
              <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="0x…"
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-white dark:bg-neutral-900 dark:text-neutral-100 text-sm font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 h-10 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-dark"
            >
              Load
            </button>
          </form>
        </>
      )}

      {isConnected && (
        <p className="text-xs text-muted flex items-start gap-2">
          <AlertTriangle className="size-4 shrink-0 text-brand" />
          In-app trading from the bet slip is next (Polymarket CLOB).{' '}
          <Link to="/settings" className="text-brand font-medium hover:underline">
            Settings
          </Link>
        </p>
      )}

      {!activeWallet.match(/^0x[a-fA-F0-9]{40}$/) ? (
        <EmptyState
          title="No wallet selected"
          description="Connect a wallet or paste a valid 0x address."
        />
      ) : isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : isError ? (
        <EmptyState title="Could not load positions" description="Check the address and try again." />
      ) : !data?.length ? (
        <EmptyState
          title="No open positions"
          description="This wallet has no Polymarket positions listed."
        />
      ) : (
        <ul className="space-y-2">
          {(data as Record<string, unknown>[]).map((pos, i) => (
            <li
              key={i}
              className="p-3 rounded-lg border border-border bg-white dark:bg-neutral-900 text-sm"
            >
              <p className="font-medium dark:text-neutral-100">
                {String(pos.title ?? pos.market ?? 'Position')}
              </p>
              <p className="text-muted text-xs mt-1">
                Size {String(pos.size ?? '—')} · Value{' '}
                {formatVolume(Number(pos.currentValue ?? pos.value ?? 0))}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
