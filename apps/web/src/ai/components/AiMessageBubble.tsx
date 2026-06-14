import { Bot, User } from 'lucide-react'
import { RelatedResourceList } from '@/ai/components/RelatedResourceList'
import type { AiTutorMessage } from '@/ai/types/tutor'
import { cn } from '@/lib/cn'

interface AiMessageBubbleProps {
  message: AiTutorMessage
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export function AiMessageBubble({ message }: AiMessageBubbleProps) {
  const isUser = message.role === 'user'
  const Icon = isUser ? User : Bot

  return (
    <article className={cn('flex gap-3', isUser && 'justify-end')}>
      {!isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-green text-cream">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      )}

      <div className={cn('max-w-[min(42rem,85%)]', isUser && 'order-first')}>
        <div
          className={cn(
            'rounded-xl px-4 py-3 text-sm leading-relaxed shadow-sm',
            isUser
              ? 'bg-primary-green text-cream'
              : 'border border-border bg-cream text-primary-dark',
          )}
        >
          <div className="whitespace-pre-line">{message.content}</div>
          {!isUser && (
            <RelatedResourceList
              lessons={message.relatedLessons}
              quizzes={message.relatedQuizzes}
              missions={message.relatedMissions}
              games={message.relatedGames}
            />
          )}
        </div>
        <p className={cn('mt-1 text-xs text-sage', isUser && 'text-right')}>
          {formatTime(message.createdAt)}
        </p>
      </div>

      {isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold text-cream">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      )}
    </article>
  )
}
