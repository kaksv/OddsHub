import { formatPercent } from '../../lib/format'

export function OddsButton({
  label,
  price,
  selected,
  onClick,
}: {
  label: string
  price: number
  selected?: boolean
  onClick: () => void
}) {
  const disabled = price <= 0 || price >= 1

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        min-w-[4.5rem] px-3 py-2 rounded-md text-sm font-semibold transition-colors
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand
        disabled:opacity-40 disabled:cursor-not-allowed
        ${
          selected
            ? 'bg-brand text-white shadow-sm'
            : 'bg-neutral-100 text-neutral-900 hover:bg-brand-light hover:text-brand-dark'
        }
      `}
      aria-pressed={selected}
    >
      <span className="block text-[10px] font-medium uppercase tracking-wide opacity-80">
        {label}
      </span>
      <span className="block text-base leading-tight">
        {disabled ? '—' : formatPercent(price)}
      </span>
    </button>
  )
}
