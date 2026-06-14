import { useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { useGamification } from '@/context/GamificationContext'
import { PageHeader } from '@/components/layout/PageHeader'

export function RewardsPage() {
  const {
    ecoCoinSummary,
    availableRewards,
    rewardPurchases,
    purchaseReward,
  } = useGamification()

  const purchasedRewardIds = useMemo(
    () => rewardPurchases.map((purchase) => purchase.rewardId),
    [rewardPurchases],
  )

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Reward Store"
        description="Spend EcoCoins on avatars, themes, and profile titles to personalize your EcoQuest experience."
      />

      <Card>
        <CardHeader>
          <CardTitle>EcoCoins</CardTitle>
          <CardDescription>Balance available for reward unlocks.</CardDescription>
        </CardHeader>
        <div className="mt-4 text-4xl font-bold text-primary-dark">
          {ecoCoinSummary.balance}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {availableRewards.map((reward) => {
          const purchased = purchasedRewardIds.includes(reward.id)
          return (
            <Card key={reward.id} variant={purchased ? 'elevated' : 'interactive'}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle>{reward.title}</CardTitle>
                    <CardDescription>{reward.category}</CardDescription>
                  </div>
                  <span className="text-2xl">{reward.icon}</span>
                </div>
              </CardHeader>
              <p className="text-sm text-sage">{reward.description}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="font-semibold text-primary-dark">Cost: {reward.cost}</span>
                <Button
                  variant={purchased ? 'secondary' : 'gold'}
                  disabled={purchased || ecoCoinSummary.balance < reward.cost}
                  onClick={() => purchaseReward(reward.id)}
                >
                  {purchased ? 'Unlocked' : 'Unlock'}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {rewardPurchases.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Unlocked rewards</CardTitle>
            <CardDescription>Items you have already claimed.</CardDescription>
          </CardHeader>
          <ul className="space-y-3">
            {rewardPurchases.map((purchase) => (
              <li key={purchase.rewardId} className="rounded-2xl border border-border bg-cream p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-primary-dark">
                    {availableRewards.find((reward) => reward.id === purchase.rewardId)?.title}
                  </span>
                  <span className="text-sm text-sage">{new Date(purchase.purchasedAt).toLocaleDateString()}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  )
}
