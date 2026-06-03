import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { MarketSource } from '../types/market'

export interface WatchItem {
  source: MarketSource
  eventSlug: string
  eventTitle: string
  marketId: string
}

const STORAGE_KEY = 'oddshub-watchlist'

function loadWatchlist(): WatchItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as WatchItem[]) : []
  } catch {
    return []
  }
}

interface WatchlistContextValue {
  items: WatchItem[]
  isWatched: (marketId: string) => boolean
  toggleWatch: (item: WatchItem) => void
  removeWatch: (marketId: string) => void
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null)

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WatchItem[]>(loadWatchlist)

  const persist = useCallback((next: WatchItem[]) => {
    setItems(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const isWatched = useCallback(
    (marketId: string) => items.some((i) => i.marketId === marketId),
    [items],
  )

  const toggleWatch = useCallback((item: WatchItem) => {
    setItems((prev) => {
      const next = prev.some((i) => i.marketId === item.marketId)
        ? prev.filter((i) => i.marketId !== item.marketId)
        : [...prev, item]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const removeWatch = useCallback(
    (marketId: string) => persist(items.filter((i) => i.marketId !== marketId)),
    [items, persist],
  )

  const value = useMemo(
    () => ({ items, isWatched, toggleWatch, removeWatch }),
    [items, isWatched, toggleWatch, removeWatch],
  )

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext)
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider')
  return ctx
}
