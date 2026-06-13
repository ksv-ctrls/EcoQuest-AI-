import { ImageIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { InfographicPlaceholder as InfographicType } from '@/types/lesson'

interface InfographicPlaceholderListProps {
  items: InfographicType[]
}

export function InfographicPlaceholderList({
  items,
}: InfographicPlaceholderListProps) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <Card
          key={item.id}
          variant="dark"
          className="overflow-hidden border-dashed border-sage/40 bg-primary-dark/5 p-0"
        >
          <div className="flex min-h-[160px] flex-col items-center justify-center gap-3 bg-linear-to-br from-primary-green/10 to-gold/10 px-6 py-10 text-center">
            <div className="rounded-full bg-cream p-3 shadow-sm">
              <ImageIcon className="size-6 text-primary-green" />
            </div>
            <div>
              <p className="font-display font-semibold text-primary-dark">
                {item.title}
              </p>
              <p className="mt-1 text-sm text-sage">{item.caption}</p>
            </div>
            <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold">
              Infographic placeholder
            </span>
          </div>
        </Card>
      ))}
    </div>
  )
}
