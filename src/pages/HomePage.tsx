import { TrendingUp, Zap } from 'lucide-react'
import { useEvents } from '../hooks/usePolymarket'
import { EventList } from '../components/markets/EventList'

const HOME_QUERY = { limit: 50 } as const

export function HomePage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useEvents(HOME_QUERY)

  return (
    <div className="space-y-4">
      <section className="rounded-lg overflow-hidden bg-gradient-to-r from-brand to-brand-dark text-white p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wider opacity-90">
          All sources. One hub.
        </p>
        <h1 className="text-xl sm:text-2xl font-bold mt-1">Popular prediction markets</h1>
        <p className="text-sm opacity-90 mt-1 max-w-lg">
          Top active markets by 24h volume — filtered from Polymarket.
        </p>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <TabPill icon={TrendingUp} label="Trending" active />
        <TabPill icon={Zap} label="High volume" />
      </div>

      <EventList
        events={data}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
        isRetrying={isFetching}
        emptyTitle="No active markets"
      />
    </div>
  )
}

function TabPill({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof TrendingUp
  label: string
  active?: boolean
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
        active
          ? 'bg-brand text-white'
          : 'bg-neutral-100 text-neutral-600'
      }`}
    >
      <Icon className="size-4" />
      {label}
    </span>
  )
}
