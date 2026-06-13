import { cn } from '@/lib/cn'

export interface AvatarProps {
  initials: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'size-8 text-sm',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
} as const

export function Avatar({ initials, className, size = 'md' }: AvatarProps) {
  return (
    <div
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-primary-green font-semibold text-cream ring-2 ring-gold/30',
        sizes[size],
        className,
      )}
      aria-hidden
    >
      {initials}
    </div>
  )
}
