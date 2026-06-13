import { Construction } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { getRouteMeta } from '@/data/navigation'

export function PlaceholderPage() {
  const { pathname } = useLocation()
  const meta = getRouteMeta(pathname)

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={meta.title} description={meta.subtitle} />
      <Card variant="elevated" className="flex flex-col items-center py-12 text-center">
        <Construction className="mb-4 size-12 text-gold" />
        <h3 className="font-display text-xl font-semibold text-primary-dark">
          Coming in a future milestone
        </h3>
        <p className="mt-2 max-w-md text-sm text-sage">
          This section is not part of Milestone 1. The navigation shell is in
          place so upcoming features can plug in cleanly.
        </p>
      </Card>
    </div>
  )
}
