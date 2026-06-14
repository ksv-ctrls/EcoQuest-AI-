import { Link } from 'react-router-dom'
import { BookOpen, Gamepad2, Sparkles, Target } from 'lucide-react'
import type { AiTutorResource } from '@/ai/types/tutor'

interface RelatedResourceListProps {
  lessons?: AiTutorResource[]
  quizzes?: AiTutorResource[]
  missions?: AiTutorResource[]
  games?: AiTutorResource[]
}

const sections = [
  { key: 'lessons', label: 'Lessons', icon: BookOpen },
  { key: 'quizzes', label: 'Quizzes', icon: Sparkles },
  { key: 'missions', label: 'Missions', icon: Target },
  { key: 'games', label: 'Games', icon: Gamepad2 },
] as const

export function RelatedResourceList({
  lessons = [],
  quizzes = [],
  missions = [],
  games = [],
}: RelatedResourceListProps) {
  const resources = { lessons, quizzes, missions, games }
  const hasResources = sections.some((section) => resources[section.key].length > 0)

  if (!hasResources) return null

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {sections.map((section) => {
        const items = resources[section.key]
        const Icon = section.icon
        if (items.length === 0) return null

        return (
          <div key={section.key} className="rounded-lg border border-border bg-cream/70 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sage">
              <Icon className="h-4 w-4" aria-hidden="true" />
              {section.label}
            </div>
            <div className="space-y-2">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className="block rounded-lg border border-transparent p-2 text-sm transition hover:border-primary-green/30 hover:bg-primary-green/5"
                >
                  <span className="font-semibold text-primary-dark">{item.title}</span>
                  <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-sage">
                    {item.description}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
