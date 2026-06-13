import { cn } from '@/lib/cn'

const variants = {
  earned:
    'border-primary-green/30 bg-primary-green/10 text-primary-dark',
  locked:
    'border-dashed border-gold/40 bg-transparent text-sage',
  sdg: 'border-transparent text-cream font-semibold',
  default: 'border-border bg-cream text-primary-dark',
} as const

export interface BadgeProps {
  variant?: keyof typeof variants
  className?: string
  children: React.ReactNode
  style?: React.CSSProperties
}

export function Badge({
  variant = 'default',
  className,
  children,
  style,
}: BadgeProps) {
  return (
    <span
      style={style}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
