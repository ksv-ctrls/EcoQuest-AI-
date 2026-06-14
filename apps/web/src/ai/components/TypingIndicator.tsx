import { Bot } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-green text-cream">
        <Bot className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="rounded-xl border border-border bg-cream px-4 py-3 text-sm text-sage shadow-sm">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary-green" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary-green [animation-delay:120ms]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary-green [animation-delay:240ms]" />
          <span className="ml-2">Eco Mentor is thinking</span>
        </span>
      </div>
    </div>
  )
}
