import { Link, useNavigate } from 'react-router-dom'
import { Menu, Search, Ticket } from 'lucide-react'
import { useSlip } from '../../context/SlipContext'
import { useState, type FormEvent } from 'react'

export function Header({
  onMenuClick,
}: {
  onMenuClick?: () => void
}) {
  const navigate = useNavigate()
  const { count, setIsOpen } = useSlip()
  const [q, setQ] = useState('')

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <header className="sticky top-0 z-40 bg-brand text-white shadow-md">
      <div className="flex items-center gap-2 px-3 h-12 sm:h-14 sm:px-4 max-w-[1600px] mx-auto">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-1 rounded-md hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
          aria-label="Open menu"
        >
          <Menu className="size-6" />
        </button>

        <Link to="/" className="flex items-center gap-2 shrink-0 mr-1">
          <span className="font-bold text-xl tracking-tight">OddsHub</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search prediction markets..."
              className="w-full h-9 pl-9 pr-3 rounded-md bg-white text-neutral-900 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </form>

        <Link
          to="/search"
          className="sm:hidden p-2 rounded-md hover:bg-white/10"
          aria-label="Search"
        >
          <Search className="size-5" />
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors"
        >
          <Ticket className="size-4" />
          <span className="hidden sm:inline">Slip</span>
          {count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-neutral-900 text-[11px] font-bold">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
