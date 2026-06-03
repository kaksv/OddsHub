import { useQuery } from '@tanstack/react-query'
import {
  fetchEventBySlug,
  fetchEvents,
  fetchTags,
  searchMarkets,
  type FetchEventsParams,
} from '../api/polymarket'

export function useEvents(params: FetchEventsParams = {}) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => fetchEvents(params),
    staleTime: 60_000,
  })
}

export function useEvent(slug: string | undefined) {
  return useQuery({
    queryKey: ['event', slug],
    queryFn: () => (slug ? fetchEventBySlug(slug) : null),
    enabled: Boolean(slug),
    staleTime: 60_000,
  })
}

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
    staleTime: 300_000,
  })
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchMarkets(query),
    enabled: query.trim().length >= 2,
    staleTime: 30_000,
  })
}
