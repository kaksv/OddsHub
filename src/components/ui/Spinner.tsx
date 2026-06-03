export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`size-8 border-2 border-brand/30 border-t-brand rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}
