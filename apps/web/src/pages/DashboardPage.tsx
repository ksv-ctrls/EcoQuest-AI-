import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Activity, BarChart3, Bot, FileText, MessageCircle } from 'lucide-react'
import {
  ContinueLearningSection,
  RecentlyCompletedSection,
  RecommendedLessonSection,
} from '@/components/dashboard/LessonLearningSections'
import {
  ActiveMissionsSection,
  MissionImpactSection,
  RecommendedMissionSection,
} from '@/components/dashboard/MissionDashboardSections'
import {
  LevelProgressCard,
  WeeklyGoalCard,
} from '@/components/dashboard/LevelProgressCard'
import { LessonProgressList } from '@/components/dashboard/LessonProgressList'
import {
  QuizAccuracySection,
  RecentQuizResultsSection,
  RecommendedQuizSection,
} from '@/components/dashboard/QuizDashboardSections'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { SummaryStats } from '@/components/dashboard/SummaryStats'
import { BadgePanel } from '@/components/dashboard/BadgePanel'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import { useAiTutor } from '@/ai/context/AiTutorContext'
import { useImpact } from '@/impact/context/ImpactContext'
import { useGamification } from '@/context/GamificationContext'
import { useGameProgress } from '@/games/context/GameProgressContext'
import { GAMES_METADATA } from '@/games/configs'
import { useRecommendation } from '@/recommendation/RecommendationContext'
import { useUserProfile } from '@/context/UserProfileContext'
import { getLessonById } from '@/data/mock/lesson-catalog'
import { getQuizById } from '@/data/mock/quiz-catalog'
import { getMissionById } from '@/data/mock/mission-catalog'
import { mockDashboardData } from '@/data/mock/dashboard'
import { GameAnalyticsSection, RecommendedGameSection } from '@/games/components/GameDashboardSections'

export function DashboardPage() {
  const data = mockDashboardData
  const {
    profile,
    ecoProfile,
    recommendedSdgIds,
    recommendedLessonId,
    recommendedQuizId,
    recommendedMissionId,
  } = useUserProfile()

  const recommendedLesson = useMemo(
    () => (recommendedLessonId ? getLessonById(recommendedLessonId) : null),
    [recommendedLessonId],
  )

  const recommendedQuiz = useMemo(
    () => (recommendedQuizId ? getQuizById(recommendedQuizId) : null),
    [recommendedQuizId],
  )

  const recommendedMission = useMemo(
    () => (recommendedMissionId ? getMissionById(recommendedMissionId) : null),
    [recommendedMissionId],
  )
  const { levelSummary, ecoCoinSummary, achievements, badges } = useGamification()
  const { gameProgress } = useGameProgress()
  const { recommendation, analyticsSummary } = useRecommendation()
  const { stats: tutorStats, suggestedPrompts } = useAiTutor()
  const impact = useImpact()

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title={`Welcome back, ${profile?.displayName ?? 'Eco Learner'}! 🌱`}
        description={
          ecoProfile
            ? `Your path includes ${ecoProfile.primarySdgTitle} and ${ecoProfile.secondarySdgTitle}.`
            : 'Complete onboarding to personalize your dashboard.'
        }
      />

      <SummaryStats />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Impact Score</CardTitle>
            <CardDescription>Combined learning and action progress.</CardDescription>
          </CardHeader>
          <div className="flex items-end justify-between gap-3">
            <p className="text-3xl font-semibold text-primary-dark">{impact.impactScore}%</p>
            <Activity className="h-6 w-6 text-primary-green" aria-hidden="true" />
          </div>
        </Card>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>SDG Mastery</CardTitle>
            <CardDescription>Average mastery across all goals.</CardDescription>
          </CardHeader>
          <div className="flex items-end justify-between gap-3">
            <p className="text-3xl font-semibold text-primary-dark">{impact.averageSdgMastery}%</p>
            <BarChart3 className="h-6 w-6 text-primary-green" aria-hidden="true" />
          </div>
        </Card>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Weekly Report</CardTitle>
            <CardDescription>{impact.weeklyReport.lessonsCompleted} lessons this week.</CardDescription>
          </CardHeader>
          <Link to="/impact/report">
            <Button variant="secondary">
              <FileText className="h-4 w-4" aria-hidden="true" />
              View report
            </Button>
          </Link>
        </Card>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              {impact.timeline[0]?.title ?? 'No activity recorded yet'}
            </CardDescription>
          </CardHeader>
          <Link to="/impact">
            <Button variant="outline">Open impact</Button>
          </Link>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Continue with AI Eco Mentor</CardTitle>
            <CardDescription>
              Pick up your SDG conversation or ask a new sustainability question.
            </CardDescription>
          </CardHeader>
          <div className="grid gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-green text-cream">
              <MessageCircle className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="min-w-0 text-sm text-sage">
              <p className="font-semibold text-primary-dark">
                {tutorStats.questionsAsked > 0
                  ? `${tutorStats.questionsAsked} questions asked`
                  : 'No questions yet'}
              </p>
              <p className="mt-1 truncate">
                {tutorStats.favoriteTopics.join(', ') || suggestedPrompts[0]}
              </p>
            </div>
            <Link to="/ai-tutor">
              <Button>
                <Bot className="h-4 w-4" aria-hidden="true" />
                Continue
              </Button>
            </Link>
          </div>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Ask Eco Mentor</CardTitle>
            <CardDescription>Get help choosing lessons, quizzes, missions, or games.</CardDescription>
          </CardHeader>
          <Link to="/ai-tutor">
            <Button variant="gold" className="w-full">
              <Bot className="h-4 w-4" aria-hidden="true" />
              Open AI Tutor
            </Button>
          </Link>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Next recommendation</CardTitle>
            <CardDescription>Learn what EcoQuest suggests you try next.</CardDescription>
          </CardHeader>
          <div className="mt-4 space-y-3 text-sm text-sage">
            <p className="font-semibold text-primary-dark">SDG Focus</p>
            <p>{recommendation.recommendedSdgId?.toUpperCase() ?? 'No SDG selected yet'}</p>
            <p className="font-semibold text-primary-dark">Game</p>
            <p>{recommendation.recommendedGame?.title ?? 'No game recommended yet'}</p>
            <p className="font-semibold text-primary-dark">Quiz</p>
            <p>{recommendation.recommendedQuiz?.title ?? 'No quiz recommended yet'}</p>
          </div>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Progress snapshot</CardTitle>
            <CardDescription>Where your learning and impact scores stand today.</CardDescription>
          </CardHeader>
          <div className="mt-4 space-y-2 text-sm text-sage">
            <div>
              <p className="text-xs uppercase tracking-wide text-sage">Sustainability score</p>
              <p className="mt-2 text-xl font-semibold text-primary-dark">{analyticsSummary.overall.sustainabilityScore}%</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-sage">Eco impact score</p>
              <p className="mt-2 text-xl font-semibold text-primary-dark">{analyticsSummary.overall.ecoImpactScore}%</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-sage">Strong SDGs</p>
              <p className="mt-2 text-primary-dark">{analyticsSummary.quiz.strongSdgs.join(', ') || 'Keep taking quizzes to identify strengths'}</p>
            </div>
          </div>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Weak areas</CardTitle>
            <CardDescription>Focus your next learning sessions on these SDGs.</CardDescription>
          </CardHeader>
          <div className="mt-4 space-y-2 text-sm text-sage">
            <p>{analyticsSummary.quiz.weakSdgs.join(', ') || 'No weak SDG identified yet'}</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Level</CardTitle>
          </CardHeader>
          <div className="mt-4 space-y-2 text-sm text-sage">
            <p className="text-xl font-semibold text-primary-dark">Level {levelSummary.currentLevel}</p>
            <p>{levelSummary.progressPercent}% progress</p>
            <p>{levelSummary.xpToNextLevel} XP to Level {levelSummary.nextLevel}</p>
          </div>
        </Card>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>EcoCoins</CardTitle>
          </CardHeader>
          <div className="mt-4 space-y-2 text-sm text-sage">
            <p className="text-xl font-semibold text-primary-dark">{ecoCoinSummary.balance}</p>
            <p>{ecoCoinSummary.lifetimeEarned} earned</p>
            <p>{ecoCoinSummary.lifetimeSpent} spent</p>
          </div>
        </Card>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Games</CardTitle>
          </CardHeader>
          <div className="mt-4 space-y-2 text-sm text-sage">
            <p className="text-xl font-semibold text-primary-dark">{GAMES_METADATA.length}</p>
            <p>{Object.values(gameProgress).filter((entry) => entry.isUnlocked).length} unlocked</p>
            <p>{Object.values(gameProgress).filter((entry) => entry.isCompleted).length} completed</p>
          </div>
        </Card>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Rewards</CardTitle>
          </CardHeader>
          <div className="mt-4 space-y-2 text-sm text-sage">
            <p className="text-xl font-semibold text-primary-dark">{achievements.filter((item) => item.unlocked).length}</p>
            <p>Achievements unlocked</p>
            <p>{badges.filter((item) => item.unlocked).length} badges earned</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>My Eco Profile</CardTitle>
            <CardDescription>
              Quick access to your personalized focus areas and learning style.
            </CardDescription>
          </CardHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-sage">Personality</p>
              <p className="mt-2 text-lg font-semibold text-primary-dark">{profile?.personalityType}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-sage">Learning style</p>
              <p className="mt-2 text-lg font-semibold text-primary-dark">{profile?.learningStyle}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-sage">Primary focus</p>
              <p className="mt-2 text-lg font-semibold text-primary-dark">{ecoProfile?.primarySdgTitle}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-sage">Secondary focus</p>
              <p className="mt-2 text-lg font-semibold text-primary-dark">{ecoProfile?.secondarySdgTitle}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {recommendedSdgIds.map((sdgId) => (
              <Chip key={sdgId}>{sdgId.toUpperCase()}</Chip>
            ))}
          </div>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Recommended SDGs</CardTitle>
            <CardDescription>
              Based on your onboarding profile, these goals are top candidates for your learning path.
            </CardDescription>
          </CardHeader>
          <div className="grid gap-3">
            {recommendedSdgIds.slice(0, 4).map((id) => (
              <Chip key={id} className="w-full justify-between">
                {id.toUpperCase()}
              </Chip>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <GameAnalyticsSection />
        <RecommendedGameSection />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Recommended Content</CardTitle>
            <CardDescription>
              Personalized learning path suggestions for lessons, quizzes, and missions.
            </CardDescription>
          </CardHeader>
          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-cream p-4">
              <p className="text-xs uppercase tracking-wide text-sage">Lesson</p>
              <p className="mt-2 font-semibold text-primary-dark">{recommendedLesson?.title ?? 'No lesson selected yet'}</p>
            </div>
            <div className="rounded-3xl border border-border bg-cream p-4">
              <p className="text-xs uppercase tracking-wide text-sage">Quiz</p>
              <p className="mt-2 font-semibold text-primary-dark">{recommendedQuiz?.title ?? 'No quiz selected yet'}</p>
            </div>
            <div className="rounded-3xl border border-border bg-cream p-4">
              <p className="text-xs uppercase tracking-wide text-sage">Mission</p>
              <p className="mt-2 font-semibold text-primary-dark">{recommendedMission?.title ?? 'No mission selected yet'}</p>
            </div>
          </div>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Learning path summary</CardTitle>
            <CardDescription>
              How your profile shapes the recommended journey.
            </CardDescription>
          </CardHeader>
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-sage">
              {ecoProfile?.recommendedLearningPath ?? 'Complete onboarding to generate a personalized learning path.'}
            </p>
            <div className="rounded-3xl bg-primary-green/10 p-4">
              <p className="text-xs uppercase tracking-wide text-sage">Format</p>
              <p className="mt-2 font-semibold text-primary-dark">{ecoProfile?.recommendedContentFormat}</p>
            </div>
            <div className="rounded-3xl bg-gold/10 p-4">
              <p className="text-xs uppercase tracking-wide text-sage">Experience</p>
              <p className="mt-2 font-semibold text-primary-dark">{ecoProfile?.recommendedExperience}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ContinueLearningSection />
        <RecommendedMissionSection />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecommendedQuizSection />
        <RecommendedLessonSection />
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <ActiveMissionsSection />
          <LessonProgressList />
          <RecentQuizResultsSection />
          <QuickActions />
        </div>

        <div className="space-y-6">
          <MissionImpactSection />
          <QuizAccuracySection />
          <RecentlyCompletedSection />
          <LevelProgressCard levelProgress={data.levelProgress} />
          <BadgePanel badges={data.badges} />
          <WeeklyGoalCard weeklyGoal={data.weeklyGoal} />
        </div>
      </div>
    </div>
  )
}
