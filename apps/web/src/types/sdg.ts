export type SDGCategory =
  | 'planet'
  | 'people'
  | 'prosperity'
  | 'peace'
  | 'partnership'

export interface SDGGoal {
  id: string
  number: number
  title: string
  shortDescription: string
  description: string
  color: string
  category: SDGCategory
  relatedLessonIds: string[]
  relatedGameIds: string[]
  keywords: string[]
}

export const SDG_CATEGORY_LABELS: Record<SDGCategory, string> = {
  planet: 'Planet',
  people: 'People',
  prosperity: 'Prosperity',
  peace: 'Peace',
  partnership: 'Partnership',
}

export const SDG_FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'planet', label: 'Planet' },
  { value: 'people', label: 'People' },
  { value: 'prosperity', label: 'Prosperity' },
  { value: 'peace', label: 'Peace' },
  { value: 'partnership', label: 'Partnership' },
] as const

export type SDGFilterValue = (typeof SDG_FILTER_OPTIONS)[number]['value']
