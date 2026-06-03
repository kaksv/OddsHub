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
  Star,
  Wallet,
  Settings,
  X,
} from 'lucide-react'
import { CATEGORIES } from '../../api/markets'

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

const EXTRA = [
  { to: '/favorites', label: 'Watchlist', icon: Star },
  { to: '/portfolio', label: 'Portfolio', icon: Wallet },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen?: boolean
  onClose?: () => void
}) {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-light dark:bg-brand/20 text-brand-dark dark:text-brand'
        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
    }`

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
          w-64 shrink-0 bg-white dark:bg-neutral-900 border-r border-border
          transform transition-transform duration-200 ease-out overflow-y-auto
          lg:translate-x-0 lg:top-0 lg:h-[calc(100dvh-3.5rem)]
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-border lg:hidden">
          <span className="font-semibold text-sm dark:text-neutral-100">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-0.5 p-3" aria-label="Categories">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted px-3 mb-2">
            Markets
          </p>
          {CATEGORIES.map(({ label, slug }) => {
            const Icon = ICONS[slug] ?? Flame
            const to = slug ? `/category/${slug}` : '/'
            return (
              <NavLink key={slug || 'popular'} to={to} end={!slug} onClick={onClose} className={linkClass}>
                <Icon className="size-[18px] shrink-0" aria-hidden />
                {label}
              </NavLink>
            )
          })}
        </nav>

        <nav className="flex flex-col gap-0.5 p-3 pt-0 border-t border-border mt-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted px-3 mb-2">
            Account
          </p>
          {EXTRA.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={onClose} className={linkClass}>
              <Icon className="size-[18px] shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mx-3 mt-4 mb-4 p-3 rounded-lg bg-brand-light dark:bg-brand/10 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
          <p className="font-semibold text-brand-dark dark:text-brand mb-1">Multi-source hub</p>
          Polymarket + Kalshi. Not affiliated with either platform.
        </div>
      </aside>
    </>
  )
}
