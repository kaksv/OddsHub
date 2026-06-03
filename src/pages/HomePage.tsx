import { useState } from 'react'
import { TrendingUp, Zap } from 'lucide-react'
import { useHubEvents } from '../hooks/useMarkets'
import { EventList } from '../components/markets/EventList'
import { FilterBar } from '../components/markets/FilterBar'
import type { HomeFeed } from '../types/market'

export function HomePage() {
  const [feed, setFeed] = useState<HomeFeed>('trending')
  const { data, isLoading, isError, error, refetch, isFetching } = useHubEvents({
    limit: 50,
    feed,
  })

  return (
    <div className="space-y-4">
      <section className="rounded-lg overflow-hidden bg-gradient-to-r from-brand to-brand-dark text-white p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wider opacity-90">
          All sources. One hub.
        </p>
        <h1 className="text-xl sm:text-2xl font-bold mt-1">Popular prediction markets</h1>
        <p className="text-sm opacity-90 mt-1 max-w-lg">
          Polymarket + Kalshi — filtered by volume, liquidity, and your preferences.
        </p>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <TabPill
          icon={TrendingUp}
          label="Trending"
          active={feed === 'trending'}
          onClick={() => setFeed('trending')}
        />
        <TabPill
          icon={Zap}
          label="High volume"
          active={feed === 'volume'}
          onClick={() => setFeed('volume')}
        />
      </div>

      <div className="grid lg:grid-cols-[1fr_240px] gap-4">
        <EventList
          events={data}
          isLoading={isLoading}
          isError={isError}
          errorMessage={error instanceof Error ? error.message : undefined}
          onRetry={() => refetch()}
          isRetrying={isFetching}
          emptyTitle="No active markets"
        />
        <FilterBar />
      </div>
    </div>
  )
}

function TabPill({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof TrendingUp
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
        active
          ? 'bg-brand text-white'
          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
      }`}
    >
      <Icon className="size-4" />
      {label}
    </button>
  )
}
