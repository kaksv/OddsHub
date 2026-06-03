import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useHubEvents } from '../hooks/useMarkets'
import { EventList } from '../components/markets/EventList'
import { FilterBar } from '../components/markets/FilterBar'
import { CATEGORIES } from '../api/markets'

export function CategoryPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const category = CATEGORIES.find((c) => c.slug === slug)
  const label = category?.label ?? slug

  const query = useMemo(
    () => ({
      limit: 50,
      ...(slug ? { tag_slug: slug } : {}),
    }),
    [slug],
  )

  const { data, isLoading, isError, error, refetch, isFetching } = useHubEvents(query)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{label}</h1>
        <p className="text-sm text-muted mt-0.5">Polymarket markets in this category</p>
      </div>
      <div className="grid lg:grid-cols-[1fr_240px] gap-4">
        <EventList
          events={data}
          isLoading={isLoading}
          isError={isError}
          errorMessage={error instanceof Error ? error.message : undefined}
          onRetry={() => refetch()}
          isRetrying={isFetching}
          emptyTitle={`No markets in ${label}`}
        />
        <FilterBar />
      </div>
    </div>
  )
}
