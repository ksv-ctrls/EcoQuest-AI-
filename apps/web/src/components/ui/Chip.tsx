import { cn } from '@/lib/cn'

export interface ChipProps {
  active?: boolean
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export function Chip({ active, className, children, onClick }: ChipProps) {
  const Component = onClick ? 'button' : 'span'

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'bg-primary-green text-cream'
          : 'border border-border bg-cream text-primary-dark hover:border-primary-green/40',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </Component>
  )
}
