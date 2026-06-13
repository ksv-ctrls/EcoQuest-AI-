import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'

export function QuickActions() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <div className="flex flex-wrap gap-3">
        <Link to="/lessons">
          <Button variant="primary">Browse Lessons</Button>
        </Link>
        <Link to="/quizzes">
          <Button variant="gold">Browse Quizzes</Button>
        </Link>
        <Link to="/missions">
          <Button variant="secondary">Browse Missions</Button>
        </Link>
        <Link to="/sdg">
          <Button variant="outline">Explore SDGs</Button>
        </Link>
      </div>
    </Card>
  )
}
