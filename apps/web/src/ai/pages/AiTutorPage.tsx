import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Bot, RotateCcw, Send } from 'lucide-react'
import { AiMessageBubble } from '@/ai/components/AiMessageBubble'
import { SuggestedPromptList } from '@/ai/components/SuggestedPromptList'
import { TypingIndicator } from '@/ai/components/TypingIndicator'
import { useAiTutor } from '@/ai/context/AiTutorContext'
import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useUserProfile } from '@/context/UserProfileContext'

export function AiTutorPage() {
  const { messages, suggestedPrompts, stats, isTyping, sendMessage, clearHistory } = useAiTutor()
  const { profile, ecoProfile } = useUserProfile()
  const [draft, setDraft] = useState('')
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [isTyping, messages])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = draft.trim()
    if (!next || isTyping) return
    sendMessage(next)
    setDraft('')
  }

  function handlePrompt(prompt: string) {
    if (isTyping) return
    sendMessage(prompt)
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-7xl flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
        <Card variant="elevated" className="flex min-h-0 flex-col p-0">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-green text-cream">
                <Bot className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-semibold text-primary-dark">AI Eco Mentor</h1>
                <p className="truncate text-sm text-sage">
                  Mock tutor for SDG learning, missions, quizzes, and games
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={clearHistory}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset
            </Button>
          </div>

          <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto bg-primary-dark/5 px-4 py-5 sm:px-6">
            {messages.length === 0 ? (
              <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-center gap-5 py-10">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-sage">
                    Start a conversation
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-primary-dark">
                    Ask about any SDG, climate action, water, pollution, or biodiversity topic.
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-sage">
                    Eco Mentor uses the local knowledge base for now and recommends EcoQuest
                    lessons, quizzes, missions, and games.
                  </p>
                </div>
                <SuggestedPromptList
                  prompts={suggestedPrompts}
                  onSelect={handlePrompt}
                  disabled={isTyping}
                />
              </div>
            ) : (
              <div className="mx-auto max-w-4xl space-y-5">
                {messages.map((message) => (
                  <AiMessageBubble key={message.id} message={message} />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={endRef} />
              </div>
            )}
          </div>

          <div className="border-t border-border bg-cream p-4">
            <div className="mb-3">
              <SuggestedPromptList
                prompts={suggestedPrompts.slice(0, 3)}
                onSelect={handlePrompt}
                disabled={isTyping}
              />
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask Eco Mentor about an SDG topic..."
                className="min-h-11 min-w-0 flex-1 rounded-lg border border-border bg-white px-4 text-sm text-primary-dark outline-none transition focus:border-primary-green focus:ring-2 focus:ring-primary-green/15"
              />
              <Button type="submit" disabled={!draft.trim() || isTyping} className="h-11 px-4">
                <Send className="h-4 w-4" aria-hidden="true" />
                Send
              </Button>
            </form>
          </div>
        </Card>

        <aside className="space-y-4">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Tutor profile</CardTitle>
              <CardDescription>Personalized with your onboarding data.</CardDescription>
            </CardHeader>
            <div className="space-y-3 text-sm text-sage">
              <div>
                <p className="text-xs uppercase tracking-wide">Learner</p>
                <p className="mt-1 font-semibold text-primary-dark">
                  {profile?.displayName ?? 'Eco Learner'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide">Learning style</p>
                <p className="mt-1 font-semibold text-primary-dark">
                  {profile?.learningStyle ?? 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide">Primary focus</p>
                <p className="mt-1 font-semibold text-primary-dark">
                  {ecoProfile?.primarySdgTitle ?? 'Complete onboarding'}
                </p>
              </div>
            </div>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
              <CardDescription>Saved locally in this browser.</CardDescription>
            </CardHeader>
            <div className="space-y-3 text-sm text-sage">
              <div>
                <p className="text-xs uppercase tracking-wide">Questions asked</p>
                <p className="mt-1 text-2xl font-semibold text-primary-dark">{stats.questionsAsked}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide">Favorite topics</p>
                <p className="mt-1 text-primary-dark">
                  {stats.favoriteTopics.join(', ') || 'No topics yet'}
                </p>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
