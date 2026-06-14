import { Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface SuggestedPromptListProps {
  prompts: string[]
  onSelect: (prompt: string) => void
  disabled?: boolean
}

export function SuggestedPromptList({ prompts, onSelect, disabled }: SuggestedPromptListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <Button
          key={prompt}
          variant="secondary"
          size="sm"
          disabled={disabled}
          className="h-auto min-h-8 justify-start whitespace-normal rounded-lg px-3 py-2 text-left"
          onClick={() => onSelect(prompt)}
        >
          <Lightbulb className="h-4 w-4 shrink-0" aria-hidden="true" />
          {prompt}
        </Button>
      ))}
    </div>
  )
}
