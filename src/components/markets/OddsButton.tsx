import { formatPercent } from '../../lib/format'

export function OddsButton({
  label,
  price,
  selected,
  live,
  onClick,
}: {
  label: string
  price: number
  selected?: boolean
  live?: boolean
  onClick: () => void
}) {
  const disabled = price <= 0 || price >= 1

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        min-w-[4.5rem] px-3 py-2 rounded-md text-sm font-semibold transition-colors relative
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand
        disabled:opacity-40 disabled:cursor-not-allowed
        ${
          selected
            ? 'bg-brand text-white shadow-sm'
            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-brand-light dark:hover:bg-brand/20 hover:text-brand-dark dark:hover:text-brand'
        }
      `}
      aria-pressed={selected}
    >
      {live && (
        <span className="absolute -top-1 -right-1 size-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" title="Live price" />
      )}
      <span className="block text-[10px] font-medium uppercase tracking-wide opacity-80">
        {label}
      </span>
      <span className="block text-base leading-tight">
        {disabled ? '—' : formatPercent(price)}
      </span>
    </button>
  )
}
