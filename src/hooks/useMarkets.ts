import { useQuery } from '@tanstack/react-query'
import {
  fetchHubEvents,
  fetchHubEvent,
  searchHubEvents,
  fetchPositions,
  type FetchMarketsParams,
} from '../api/markets'
import { useFilters } from '../context/FilterContext'
import type { MarketSource } from '../types/market'
import { fetchMidpoints } from '../api/clob'
import type { HubEvent } from '../types/market'

export function useHubEvents(params: Omit<FetchMarketsParams, 'filters'> = {}) {
  const { filters } = useFilters()
  return useQuery({
    queryKey: ['hub-events', params, filters],
    queryFn: () => fetchHubEvents({ ...params, filters }),
    staleTime: 60_000,
  })
}

export function useHubEvent(source: MarketSource | undefined, slug: string | undefined) {
  return useQuery({
    queryKey: ['hub-event', source, slug],
    queryFn: () =>
      source && slug ? fetchHubEvent(source, slug) : null,
    enabled: Boolean(source && slug),
    staleTime: 60_000,
  })
}

export function useSearch(query: string) {
  const { filters } = useFilters()
  return useQuery({
    queryKey: ['hub-search', query, filters],
    queryFn: () => searchHubEvents(query, filters),
    enabled: query.trim().length >= 2,
    staleTime: 30_000,
  })
}

export function usePositions(wallet: string | undefined) {
  return useQuery({
    queryKey: ['positions', wallet],
    queryFn: () => (wallet ? fetchPositions(wallet) : []),
    enabled: Boolean(wallet?.match(/^0x[a-fA-F0-9]{40}$/)),
    staleTime: 60_000,
  })
}

function collectTokenIds(events: HubEvent[] | undefined): string[] {
  if (!events) return []
  return events.flatMap((e) =>
    e.markets.flatMap((m) => m.clobTokenIds ?? []).filter(Boolean),
  )
}

export function useLivePrices(events: HubEvent[] | undefined) {
  const tokenIds = collectTokenIds(events)
  return useQuery({
    queryKey: ['live-prices', tokenIds.slice(0, 40).join(',')],
    queryFn: () => fetchMidpoints(tokenIds),
    enabled: tokenIds.length > 0,
    refetchInterval: 30_000,
    staleTime: 15_000,
  })
}
