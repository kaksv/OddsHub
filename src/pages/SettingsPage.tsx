import { useTheme } from '../context/ThemeContext'
import { useFilters } from '../context/FilterContext'
import { Moon, Sun } from 'lucide-react'

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { filters, resetFilters } = useFilters()

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-xl font-bold dark:text-neutral-100">Settings</h1>

      <section className="p-4 rounded-lg border border-border bg-white dark:bg-neutral-900 space-y-3">
        <h2 className="font-semibold dark:text-neutral-100">Appearance</h2>
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium dark:text-neutral-100"
        >
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        </button>
      </section>

      <section className="p-4 rounded-lg border border-border bg-white dark:bg-neutral-900 space-y-2 text-sm">
        <h2 className="font-semibold dark:text-neutral-100">Default filters</h2>
        <p className="text-muted">Sources: {filters.sources.join(', ')}</p>
        <p className="text-muted">Min volume: ${filters.minVolume24h.toLocaleString()}</p>
        <p className="text-muted">Min liquidity: ${filters.minLiquidity.toLocaleString()}</p>
        <button
          type="button"
          onClick={resetFilters}
          className="text-brand font-semibold hover:underline"
        >
          Reset filters
        </button>
      </section>

      <section className="p-4 rounded-lg border border-border bg-white dark:bg-neutral-900 space-y-3">
        <h2 className="font-semibold dark:text-neutral-100">Wallet</h2>
        <p className="text-sm text-muted">
          Polygon wallet via Reown AppKit (MetaMask, WalletConnect, etc.). Trading from the bet
          slip — step 2 — uses Polymarket CLOB next.
        </p>
      </section>

      <section className="p-4 rounded-lg border border-border bg-white dark:bg-neutral-900 text-sm text-muted">
        <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Data sources</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Polymarket (Gamma + CLOB live prices)</li>
          <li>Kalshi (events API)</li>
          <li>More sources planned</li>
        </ul>
      </section>
    </div>
  )
}
