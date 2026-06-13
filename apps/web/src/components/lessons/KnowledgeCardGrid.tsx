import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import type { KnowledgeCard as KnowledgeCardType } from '@/types/lesson'
import { cn } from '@/lib/cn'

interface KnowledgeCardGridProps {
  cards: KnowledgeCardType[]
  onInteract?: () => void
}

export function KnowledgeCardGrid({ cards, onInteract }: KnowledgeCardGridProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((card) => {
        const isExpanded = expandedId === card.id

        return (
          <Card
            key={card.id}
            variant="interactive"
            role="button"
            tabIndex={0}
            onClick={() => {
              setExpandedId(isExpanded ? null : card.id)
              onInteract?.()
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setExpandedId(isExpanded ? null : card.id)
                onInteract?.()
              }
            }}
            className={cn(
              'cursor-pointer transition-all',
              isExpanded && 'ring-2 ring-gold/40',
            )}
          >
            <div className="flex items-start gap-3">
              {card.emoji ? (
                <span className="text-2xl" aria-hidden>
                  {card.emoji}
                </span>
              ) : null}
              <div>
                <h4 className="font-display font-semibold text-primary-dark">
                  {card.title}
                </h4>
                <p
                  className={cn(
                    'mt-2 text-sm leading-relaxed text-sage',
                    !isExpanded && 'line-clamp-2',
                  )}
                >
                  {card.body}
                </p>
                <p className="mt-2 text-xs font-medium text-gold">
                  {isExpanded ? 'Tap to collapse' : 'Tap to learn more'}
                </p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
