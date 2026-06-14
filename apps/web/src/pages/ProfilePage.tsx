import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { useAiTutor } from '@/ai/context/AiTutorContext'
import { useGamification } from '@/context/GamificationContext'
import { useRecommendation } from '@/recommendation/RecommendationContext'
import { useUserProfile } from '@/context/UserProfileContext'

const achievementLabels = {
  explorer: 'Eco Explorer',
  competitive: 'Quiz Challenger',
  creative: 'Project Pioneer',
  social: 'Community Champion',
}

export function ProfilePage() {
  const { profile, ecoProfile, recommendedSdgIds } = useUserProfile()
  const { recommendation, analyticsSummary } = useRecommendation()
  const { levelSummary, ecoCoinSummary, streakSummary, achievements, badges } = useGamification()
  const { stats: tutorStats } = useAiTutor()

  if (!profile || !ecoProfile) {
    return (
      <div className="mx-auto max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>No profile found</CardTitle>
            <CardDescription>
              Start the onboarding process to create your Eco Profile.
            </CardDescription>
          </CardHeader>
          <Link to="/onboarding">
            <Button>Start onboarding</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const habitLabels = {
    recycling: 'Recycling',
    water_conservation: 'Water conservation',
    energy_saving: 'Energy saving',
    public_transport: 'Public transport',
    waste_segregation: 'Waste segregation',
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-primary-dark">Eco Profile</h1>
        <p className="max-w-2xl text-sm text-sage">
          Your personalized sustainability dashboard, learning preferences, and achievement summary.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Level</CardTitle>
            <CardDescription>Current learner level and XP progress.</CardDescription>
          </CardHeader>
          <div className="mt-4 space-y-2 text-sm text-sage">
            <p className="text-xl font-semibold text-primary-dark">Level {levelSummary.currentLevel}</p>
            <p>{levelSummary.progressPercent}% progress</p>
            <p>{levelSummary.xpToNextLevel} XP to Level {levelSummary.nextLevel}</p>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Impact score</CardTitle>
            <CardDescription>How your behavior and performance can drive sustainability.</CardDescription>
          </CardHeader>
          <div className="mt-4 space-y-2 text-sm text-sage">
            <p className="text-xl font-semibold text-primary-dark">{analyticsSummary.overall.ecoImpactScore}%</p>
            <p>{analyticsSummary.learning.lessonsCompleted} lessons completed</p>
            <p>{analyticsSummary.mission.completedMissions} missions finished</p>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended focus</CardTitle>
            <CardDescription>Personalized next steps from EcoQuest analytics.</CardDescription>
          </CardHeader>
          <div className="mt-4 space-y-2 text-sm text-sage">
            <p className="text-lg font-semibold text-primary-dark">{recommendation.recommendedSdgId?.toUpperCase() ?? 'None yet'}</p>
            <p>{recommendation.recommendedGame?.title ?? 'Play a recommended game to unlock more insights.'}</p>
            <p>{recommendation.recommendedQuiz?.title ?? 'Take a quiz to refine learning priorities.'}</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>AI Tutor questions</CardTitle>
            <CardDescription>Questions you have asked Eco Mentor.</CardDescription>
          </CardHeader>
          <div className="mt-4 space-y-2 text-sm text-sage">
            <p className="text-xl font-semibold text-primary-dark">{tutorStats.questionsAsked}</p>
            <p>
              {tutorStats.lastConversationAt
                ? `Last conversation ${new Date(tutorStats.lastConversationAt).toLocaleDateString()}`
                : 'Start a conversation to build your tutor history.'}
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Favorite topics</CardTitle>
            <CardDescription>Detected from your AI Tutor questions.</CardDescription>
          </CardHeader>
          <div className="mt-4 flex flex-wrap gap-2">
            {tutorStats.favoriteTopics.length > 0 ? (
              tutorStats.favoriteTopics.map((topic) => <Chip key={topic}>{topic}</Chip>)
            ) : (
              <p className="text-sm text-sage">No favorite topics yet.</p>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning interests</CardTitle>
            <CardDescription>Profile interests used by Eco Mentor.</CardDescription>
          </CardHeader>
          <div className="mt-4 flex flex-wrap gap-2">
            {tutorStats.learningInterests.map((topic) => (
              <Chip key={topic}>{topic}</Chip>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>EcoCoins</CardTitle>
            <CardDescription>Currency available for rewards and personalization.</CardDescription>
          </CardHeader>
          <div className="mt-4 space-y-2 text-sm text-sage">
            <p className="text-xl font-semibold text-primary-dark">{ecoCoinSummary.balance}</p>
            <p>{ecoCoinSummary.lifetimeEarned} earned</p>
            <p>{ecoCoinSummary.lifetimeSpent} spent</p>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Streak</CardTitle>
            <CardDescription>Track your learning momentum.</CardDescription>
          </CardHeader>
          <div className="mt-4 space-y-2 text-sm text-sage">
            <p className="text-xl font-semibold text-primary-dark">{streakSummary.currentStreak} days</p>
            <p>Weekly streak {streakSummary.weeklyStreak}</p>
            <p>Longest streak {streakSummary.longestStreak} days</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Learning preferences</CardTitle>
            <CardDescription>
              How EcoQuest tailors content to your style and personality.
            </CardDescription>
          </CardHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-sage">Personality</p>
              <p className="mt-2 text-lg font-semibold text-primary-dark">{profile.personalityType}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-sage">Learning style</p>
              <p className="mt-2 text-lg font-semibold text-primary-dark">{profile.learningStyle}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-sage">Education</p>
              <p className="mt-2 text-lg font-semibold text-primary-dark">{profile.education.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-sage">Age</p>
              <p className="mt-2 text-lg font-semibold text-primary-dark">{profile.age}</p>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eco Profile summary</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div className="rounded-3xl bg-primary-green/10 p-5">
              <p className="text-xs uppercase tracking-wide text-sage">Sustainability Score</p>
              <p className="mt-2 text-3xl font-semibold text-primary-dark">{ecoProfile.sustainabilityScore}%</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-sage">Primary SDG focus</p>
              <p className="mt-2 text-lg font-semibold text-primary-dark">{ecoProfile.primarySdgTitle}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-sage">Secondary SDG focus</p>
              <p className="mt-2 text-lg font-semibold text-primary-dark">{ecoProfile.secondarySdgTitle}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-sage">Recommended path</p>
              <p className="mt-2 text-sm text-sage">{ecoProfile.recommendedLearningPath}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Impact journey</CardTitle>
            <CardDescription>
              The SDGs you care about most and how they shape your goals.
            </CardDescription>
          </CardHeader>
          <div className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedSdgIds.map((sdgId) => (
                <Chip key={sdgId}>{sdgId.toUpperCase()}</Chip>
              ))}
            </div>
            <div className="rounded-3xl border border-border bg-cream p-4 text-sm text-sage">
              <p>
                You selected {profile.impactAreas.length} Sustainable Development Goals as your main focus. EcoQuest will use this to surface lessons, quizzes, and missions that support your impact priorities.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-cream p-5">
              <p className="text-sm font-semibold text-primary-dark">Unlocked achievements</p>
              <p className="mt-2 text-sm text-sage">{achievements.filter((item) => item.unlocked).length} unlocked so far.</p>
            </div>
            <div className="rounded-3xl border border-border bg-cream p-5">
              <p className="text-sm font-semibold text-primary-dark">Badges earned</p>
              <p className="mt-2 text-sm text-sage">{badges.filter((item) => item.unlocked).length} badges collected.</p>
            </div>
            <div className="rounded-3xl border border-border bg-cream p-5">
              <p className="text-sm font-semibold text-primary-dark">Personality reward</p>
              <p className="mt-2 text-sm text-sage">{achievementLabels[profile.personalityType]}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Learning preferences</CardTitle>
          <CardDescription>
            Review the formats and topics that best match your onboarding profile.
          </CardDescription>
        </CardHeader>
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-sage">Content format</p>
            <p className="mt-2 text-lg font-semibold text-primary-dark">{ecoProfile.recommendedContentFormat}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-sage">Personality experience</p>
            <p className="mt-2 text-lg font-semibold text-primary-dark">{ecoProfile.recommendedExperience}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-sage">Sustainability habits</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.sustainabilityHabits.map((habit) => (
                <Chip key={habit}>{habitLabels[habit]}</Chip>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link to="/dashboard">
          <Button variant="secondary">Back to dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
