import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'

export interface StatCardProps {
  label: string
  value: string | number
  note?: string
  icon?: LucideIcon
  className?: string
}

export function StatCard({
  label,
  value,
  note,
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <Card variant="interactive" className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-sage">{label}</p>
        {Icon ? (
          <Icon className="size-4 shrink-0 text-gold" aria-hidden />
        ) : null}
      </div>
      <p className="font-display text-3xl font-bold tracking-tight text-primary-dark">
        {value}
      </p>
      {note ? <p className="text-sm text-sage">{note}</p> : null}
    </Card>
  )
}
