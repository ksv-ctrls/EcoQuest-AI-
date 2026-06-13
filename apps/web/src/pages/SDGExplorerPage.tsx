import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import {
  SDGDetailPanel,
  SDGGrid,
} from '@/components/sdg/SDGExplorer'
import { PageHeader } from '@/components/layout/PageHeader'
import { Chip } from '@/components/ui/Chip'
import { mockSdgGoals, getSdgById } from '@/data/mock/sdg'
import {
  SDG_FILTER_OPTIONS,
  type SDGFilterValue,
  type SDGGoal,
} from '@/types/sdg'

export function SDGExplorerPage() {
  const { goalId } = useParams<{ goalId?: string }>()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<SDGFilterValue>('all')

  const selectedGoal = goalId ? getSdgById(goalId) ?? null : null

  const filteredGoals = useMemo(() => {
    const query = search.trim().toLowerCase()

    return mockSdgGoals.filter((goal) => {
      const matchesCategory =
        categoryFilter === 'all' || goal.category === categoryFilter

      const matchesSearch =
        query.length === 0 ||
        goal.title.toLowerCase().includes(query) ||
        goal.shortDescription.toLowerCase().includes(query) ||
        goal.keywords.some((keyword) => keyword.includes(query))

      return matchesCategory && matchesSearch
    })
  }, [search, categoryFilter])

  const handleSelectGoal = (goal: SDGGoal) => {
    navigate(`/sdg/${goal.id}`)
  }

  const handleCloseDetail = () => {
    navigate('/sdg')
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Explore the 17 Sustainable Development Goals"
        description="Search goals, filter by theme, and discover related lessons and games."
      />

      <div className="space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-sage" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search goals, topics, or keywords..."
            className="w-full rounded-xl border border-border bg-cream py-3 pl-10 pr-4 text-primary-dark placeholder:text-sage focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {SDG_FILTER_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              active={categoryFilter === option.value}
              onClick={() => setCategoryFilter(option.value)}
            >
              {option.label}
            </Chip>
          ))}
        </div>
      </div>

      <SDGGrid
        goals={filteredGoals}
        selectedGoalId={selectedGoal?.id}
        onSelectGoal={handleSelectGoal}
      />

      <SDGDetailPanel goal={selectedGoal} onClose={handleCloseDetail} />
    </div>
  )
}
