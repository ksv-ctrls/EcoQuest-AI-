import { PageHeader } from '@/components/layout/PageHeader'
import { LearningStatsBar } from '@/components/lessons/LearningStatsBar'
import { SDGCatalogCard } from '@/components/lessons/SDGCatalogCard'
import { useLessonProgress } from '@/context/LessonProgressContext'
import { getAllSdgCatalogs, getSdgCatalogStats } from '@/data/mock/lesson-catalog'

export function LessonsCatalogPage() {
  const { progress, learningStats } = useLessonProgress()
  const catalogs = getAllSdgCatalogs()

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="SDG Learning Paths"
        description="Browse lessons organized by all 17 Sustainable Development Goals. Track completion and estimated learning time for each goal."
      />

      <LearningStatsBar stats={learningStats} />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {catalogs.map((catalog) => {
          const stats = getSdgCatalogStats(catalog.sdgId, progress)!
          return (
            <SDGCatalogCard
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
