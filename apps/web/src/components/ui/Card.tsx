import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const variants = {
  default: 'bg-cream border border-border text-primary-dark',
  elevated: 'bg-cream border border-border text-primary-dark shadow-lg shadow-primary-dark/5',
  interactive:
    'bg-cream border border-border text-primary-dark transition-all hover:border-primary-green/40 hover:shadow-md',
  dark: 'bg-primary-dark/5 border border-border text-primary-dark',
} as const

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-xl p-5', variants[variant], className)}
      {...props}
    />
  ),
)

Card.displayName = 'Card'

export const CardHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-4 space-y-1', className)} {...props} />
)

export const CardTitle = ({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn('text-lg font-semibold text-primary-dark', className)}
    {...props}
  />
)

export const CardDescription = ({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-sage', className)} {...props} />
)
