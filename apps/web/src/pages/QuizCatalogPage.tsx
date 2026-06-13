import { PageHeader } from '@/components/layout/PageHeader'
import { SDGQuizCatalogCard } from '@/components/quizzes/SDGQuizCatalogCard'
import { QuizStatsBar } from '@/components/quizzes/QuizStatsBar'
import { useQuizProgress } from '@/context/QuizProgressContext'
import {
  getAllSdgQuizCatalogs,
  getSdgQuizStats,
} from '@/data/mock/quiz-catalog'

export function QuizCatalogPage() {
  const { results, quizStats } = useQuizProgress()
  const catalogs = getAllSdgQuizCatalogs()

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="SDG Quiz Hub"
        description="Every lesson has a linked quiz. Test your knowledge across multiple question types and earn XP."
      />

      <QuizStatsBar stats={quizStats} />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {catalogs.map((catalog) => {
          const stats = getSdgQuizStats(catalog.sdgId, results)!
          return (
            <SDGQuizCatalogCard
              key={catalog.sdgId}
              catalog={catalog}
              stats={stats}
            />
          )
        })}
      </div>
    </div>
  )
}
