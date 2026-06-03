import { useSearchParams } from 'react-router-dom'
import { useState, type FormEvent } from 'react'
import { Search } from 'lucide-react'
import { useSearch } from '../hooks/usePolymarket'
import { EventList } from '../components/markets/EventList'

export function SearchPage() {
  const [params, setParams] = useSearchParams()
  const initial = params.get('q') ?? ''
  const [input, setInput] = useState(initial)
  const query = params.get('q') ?? ''

  const { data, isLoading, isError } = useSearch(query)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setParams(input.trim() ? { q: input.trim() } : {})
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Search</h1>
      <form onSubmit={handleSubmit} className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted" />
        <input
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Events, politics, crypto..."
          className="w-full h-11 pl-10 pr-4 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
          autoFocus
        />
      </form>

      {query.length >= 2 ? (
        <>
          <p className="text-sm text-muted">
            Results for <strong className="text-neutral-800">&quot;{query}&quot;</strong>
          </p>
          <EventList
            events={data}
            isLoading={isLoading}
            isError={isError}
            emptyTitle="No results"
          />
        </>
      ) : (
        <p className="text-sm text-muted">Enter at least 2 characters to search.</p>
      )}
    </div>
  )
}
