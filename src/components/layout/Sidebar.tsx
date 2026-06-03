import { NavLink } from 'react-router-dom'
import {
  Flame,
  Trophy,
  Landmark,
  Bitcoin,
  Briefcase,
  FlaskConical,
  Sparkles,
  Cpu,
  X,
} from 'lucide-react'
import { CATEGORIES } from '../../api/polymarket'

const ICONS: Record<string, typeof Flame> = {
  '': Flame,
  politics: Landmark,
  sports: Trophy,
  crypto: Bitcoin,
  business: Briefcase,
  science: FlaskConical,
  'pop-culture': Sparkles,
  tech: Cpu,
}

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen?: boolean
  onClose?: () => void
}) {
  const nav = (
    <nav className="flex flex-col gap-0.5 p-3" aria-label="Categories">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted px-3 mb-2">
        Markets
      </p>
      {CATEGORIES.map(({ label, slug }) => {
        const Icon = ICONS[slug] ?? Flame
        const to = slug ? `/category/${slug}` : '/'
        return (
          <NavLink
            key={slug || 'popular'}
            to={to}
            end={!slug}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-light text-brand-dark'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`
            }
          >
            <Icon className="size-[18px] shrink-0" aria-hidden />
            {label}
          </NavLink>
        )
      })}
    </nav>
  )

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          aria-label="Close menu"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed lg:sticky top-12 sm:top-14 left-0 z-50 lg:z-0
          h-[calc(100dvh-3rem)] sm:h-[calc(100dvh-3.5rem)] lg:h-auto
          w-64 shrink-0 bg-white border-r border-border
          transform transition-transform duration-200 ease-out
          lg:translate-x-0 lg:top-0 lg:h-[calc(100dvh-3.5rem)]
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-border lg:hidden">
          <span className="font-semibold text-sm">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md hover:bg-neutral-100"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        {nav}
        <div className="mx-3 mt-4 p-3 rounded-lg bg-brand-light text-xs text-neutral-700 leading-relaxed">
          <p className="font-semibold text-brand-dark mb-1">Read-only preview</p>
          Data from Polymarket. OddsHub is not affiliated with Polymarket or BetPawa.
        </div>
      </aside>
    </>
  )
}
