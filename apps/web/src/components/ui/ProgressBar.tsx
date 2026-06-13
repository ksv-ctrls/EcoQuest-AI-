import { cn } from '@/lib/cn'

export interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  barClassName?: string
  variant?: 'default' | 'gold'
  label?: string
}

export function ProgressBar({
  value,
  max = 100,
  className,
  barClassName,
  variant = 'default',
  label,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn('space-y-2', className)}>
      {label ? (
        <div className="flex items-center justify-between text-sm text-sage">
          <span>{label}</span>
          <span>{Math.round(percent)}%</span>
        </div>
      ) : null}
      <div
        className="h-2.5 overflow-hidden rounded-full border border-border bg-cream"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            variant === 'gold'
              ? 'bg-gold'
              : 'bg-linear-to-r from-primary-green to-primary-green/70',
            barClassName,
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
