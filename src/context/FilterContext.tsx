import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEFAULT_FILTERS, type MarketFilters } from '../types/market'

const STORAGE_KEY = 'oddshub-filters'

function loadFilters(): MarketFilters {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_FILTERS
    return { ...DEFAULT_FILTERS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_FILTERS
  }
}

interface FilterContextValue {
  filters: MarketFilters
  setFilters: (next: Partial<MarketFilters>) => void
  resetFilters: () => void
}

const FilterContext = createContext<FilterContextValue | null>(null)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<MarketFilters>(loadFilters)

  const setFilters = useCallback((next: Partial<MarketFilters>) => {
    setFiltersState((prev) => {
      const merged = { ...prev, ...next }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      return merged
    })
  }, [])

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FILTERS))
  }, [])

  const value = useMemo(
    () => ({ filters, setFilters, resetFilters }),
    [filters, setFilters, resetFilters],
  )

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
}

export function useFilters() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilters must be used within FilterProvider')
  return ctx
}
