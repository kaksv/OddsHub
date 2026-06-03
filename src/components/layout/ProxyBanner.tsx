import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { checkProxyHealth } from '../../api/markets'

export function ProxyBanner() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['proxy-health'],
    queryFn: checkProxyHealth,
    retry: 1,
    staleTime: 30_000,
  })

  if (isLoading || data?.ok) return null

  return (
    <div
      role="alert"
      className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border border-amber-300 bg-amber-50 text-amber-950 text-sm"
    >
      <div className="flex items-start gap-2 flex-1">
        <AlertTriangle className="size-5 shrink-0 text-amber-600 mt-0.5" aria-hidden />
        <div>
          <p className="font-semibold">API proxy is not reachable</p>
          <p className="mt-0.5 text-amber-900/90">
            {data?.error ??
              'Start the app with npm run dev (runs the proxy on port 8787).'}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => refetch()}
        disabled={isFetching}
        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 disabled:opacity-60 shrink-0"
      >
        <RefreshCw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} />
        Retry
      </button>
    </div>
  )
}
