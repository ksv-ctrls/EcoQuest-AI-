import { Badge } from '@/components/ui/Badge'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import type { Badge as BadgeType } from '@/types/dashboard'

interface BadgePanelProps {
  badges: BadgeType[]
}

export function BadgePanel({ badges }: BadgePanelProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Your Badges</CardTitle>
      </CardHeader>
      <ul className="space-y-2">
        {badges.map((badge) => (
          <li key={badge.id}>
            <Badge
              variant={badge.earned ? 'earned' : 'locked'}
              className="w-full justify-start gap-2 px-3 py-2.5 text-sm"
            >
              <span>{badge.emoji}</span>
              <span className="font-semibold">{badge.title}</span>
              <span className="font-normal text-sage">— {badge.description}</span>
            </Badge>
          </li>
        ))}
      </ul>
    </Card>
  )
}
