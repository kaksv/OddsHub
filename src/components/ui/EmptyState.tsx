import { Inbox } from 'lucide-react'

export function EmptyState({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="size-14 rounded-full bg-brand-light flex items-center justify-center mb-4">
        <Inbox className="size-7 text-brand" aria-hidden />
      </div>
      <h3 className="font-semibold text-lg text-neutral-900">{title}</h3>
      {description && (
        <p className="text-muted text-sm mt-1 max-w-sm">{description}</p>
      )}
    </div>
  )
}
