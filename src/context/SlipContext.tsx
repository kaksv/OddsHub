import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { MarketSource } from '../types/market'

export interface SlipSelection {
  source: MarketSource
  eventId: string
  eventTitle: string
  marketId: string
  question: string
  outcome: string
  price: number
  /** Polymarket CLOB conditional token id */
  tokenId?: string
  tickSize?: string
  negRisk?: boolean
}

interface SlipContextValue {
  selections: SlipSelection[]
  addSelection: (item: SlipSelection) => void
  removeSelection: (marketId: string, outcome: string) => void
  clearSlip: () => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  count: number
}

const SlipContext = createContext<SlipContextValue | null>(null)

export function SlipProvider({ children }: { children: ReactNode }) {
  const [selections, setSelections] = useState<SlipSelection[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addSelection = useCallback((item: SlipSelection) => {
    setSelections((prev) => {
      const without = prev.filter(
        (s) => !(s.marketId === item.marketId),
      )
      return [...without, item]
    })
    setIsOpen(true)
  }, [])

  const removeSelection = useCallback((marketId: string, outcome: string) => {
    setSelections((prev) =>
      prev.filter((s) => !(s.marketId === marketId && s.outcome === outcome)),
    )
  }, [])

  const clearSlip = useCallback(() => setSelections([]), [])

  const value = useMemo(
    () => ({
      selections,
      addSelection,
      removeSelection,
      clearSlip,
      isOpen,
      setIsOpen,
      count: selections.length,
    }),
    [selections, addSelection, removeSelection, clearSlip, isOpen],
  )

  return <SlipContext.Provider value={value}>{children}</SlipContext.Provider>
}

export function useSlip() {
  const ctx = useContext(SlipContext)
  if (!ctx) throw new Error('useSlip must be used within SlipProvider')
  return ctx
}
