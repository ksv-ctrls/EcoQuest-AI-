import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Leaf,
  Sparkles,
  Upload,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { useMissionProgress } from '@/context/MissionProgressContext'
import { useGamification } from '@/context/GamificationContext'
import {
  formatEcoCoins,
  missionDifficultyLabels,
  missionStateLabels,
} from '@/lib/mission-labels'
import { formatDuration } from '@/lib/lesson-labels'
import type { Mission, MissionState } from '@/types/mission'
import { cn } from '@/lib/cn'

interface MissionDetailProps {
  mission: Mission
  sdgTitle: string
  sdgColor: string
}

export function MissionDetail({ mission, sdgTitle, sdgColor }: MissionDetailProps) {
  const {
    getState,
    startMission,
    submitMission,
    approveMission,
    completeMission,
    progress,
  } = useMissionProgress()
  const { trackMissionStart, trackMissionSubmit, trackMissionComplete } = useGamification()

  const state = getState(mission.id)
  const entry = progress[mission.id]
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [notes, setNotes] = useState(entry?.submission?.notes ?? '')
  const [photoPreview, setPhotoPreview] = useState(entry?.submission?.photoPreview)
  const [photoName, setPhotoName] = useState(entry?.submission?.photoName)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const isPlaceholder = mission.isPlaceholder

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setPhotoName(file.name)
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (!notes.trim()) return
    submitMission(mission.id, { notes: notes.trim(), photoName, photoPreview })
    trackMissionSubmit(mission.id, mission.sdgId)
    setShowConfirmation(true)
  }

  const handleApproveAndComplete = () => {
    approveMission(mission.id)
    completeMission(mission.id)
    trackMissionComplete(mission.id, mission.sdgId)
  }

  if (isPlaceholder) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <Card variant="elevated" className="py-12">
          <h2 className="font-display text-xl font-semibold text-primary-dark">
            Mission coming soon
          </h2>
          <p className="mt-2 text-sage">
            {mission.title} will be available in a future update.
          </p>
          <Link to={`/missions/${mission.sdgId}`} className="mt-6 inline-block">
            <Button variant="outline">Back to SDG missions</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to={`/missions/${mission.sdgId}`}>
        <Button variant="outline" size="sm">
          <ArrowLeft className="size-4" />
          Back to {sdgTitle}
        </Button>
      </Link>

      <header
        className="overflow-hidden rounded-2xl border border-border bg-cream shadow-lg"
        style={{
          backgroundImage: `linear-gradient(135deg, ${sdgColor}18 0%, #fbf6f0 50%, #b9915e10 100%)`,
        }}
      >
        <div className="h-1.5" style={{ backgroundColor: sdgColor }} />
        <div className="p-6 sm:p-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="sdg" style={{ backgroundColor: sdgColor }} className="rounded-md px-2.5 py-1">
              SDG {mission.sdgNumber}
            </Badge>
            <StateBadge state={state} />
            <span className="text-sm text-sage">
              {missionDifficultyLabels[mission.difficulty]}
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold text-primary-dark">{mission.title}</h1>
          <p className="mt-3 text-sage">{mission.description}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-sage">
            <span className="flex items-center gap-1">
              <Clock className="size-4" />
              {formatDuration(mission.estimatedMinutes)}
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="size-4 text-gold" />
              {mission.xpReward} XP
            </span>
            <span>{formatEcoCoins(mission.ecoCoinReward)}</span>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Objectives">
          <ul className="space-y-2">
            {mission.objectives.map((obj) => (
              <li key={obj} className="flex gap-2 text-sm text-primary-dark">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary-green" />
                {obj}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Environmental impact">
          <div className="rounded-lg bg-primary-green/10 p-4">
            <p className="flex items-center gap-2 font-display font-semibold text-primary-dark">
              <Leaf className="size-5 text-primary-green" />
              {mission.impactMetric.label}: {mission.impactMetric.targetValue}{' '}
              {mission.impactMetric.unit}
            </p>
            <p className="mt-2 text-sm text-sage">{mission.impactMetric.description}</p>
            <p className="mt-3 text-sm leading-relaxed text-primary-dark/90">
              {mission.environmentalImpact}
            </p>
          </div>
        </Section>
      </div>

      <Section title="Instructions">
        <ol className="list-decimal space-y-2 pl-5 text-sm text-primary-dark">
          {mission.instructions.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </Section>

      <Section title="Rewards">
        <div className="flex flex-wrap gap-4">
          <RewardPill label="XP" value={`+${mission.xpReward}`} />
          <RewardPill label="Eco Coins" value={formatEcoCoins(mission.ecoCoinReward)} />
          <RewardPill
            label="Impact"
            value={`${mission.impactMetric.targetValue} ${mission.impactMetric.unit}`}
          />
        </div>
      </Section>

      <div className="grid gap-4 sm:grid-cols-2">
        {mission.relatedLessonId ? (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="size-4 text-primary-green" />
                Related lesson
              </CardTitle>
            </CardHeader>
            <Link
              to={`/lessons/${mission.sdgId}/${mission.relatedLessonId}`}
              className="text-sm font-medium text-primary-green hover:underline"
            >
              Review lesson before starting →
            </Link>
          </Card>
        ) : null}
        {mission.relatedQuizId ? (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="size-4 text-gold" />
                Related quiz
              </CardTitle>
            </CardHeader>
            <Link
              to={`/quizzes/${mission.sdgId}/${mission.relatedQuizId}`}
              className="text-sm font-medium text-primary-green hover:underline"
            >
              Test your knowledge →
            </Link>
          </Card>
        ) : null}
      </div>

      {state === 'completed' ? (
        <Card variant="elevated" className="border-primary-green/30 bg-primary-green/5 text-center py-8">
          <CheckCircle2 className="mx-auto mb-3 size-12 text-primary-green" />
          <h3 className="font-display text-xl font-bold text-primary-dark">Mission completed!</h3>
          <p className="mt-2 text-sm text-sage">
            You earned {mission.xpReward} XP and {formatEcoCoins(mission.ecoCoinReward)}.
          </p>
        </Card>
      ) : state === 'submitted' || state === 'approved' ? (
        <Card variant="elevated" className="border-gold/30 bg-gold/5">
          <h3 className="font-display font-semibold text-primary-dark">Submission received</h3>
          <p className="mt-2 text-sm text-sage">{entry?.submission?.notes}</p>
          {state === 'approved' ? (
            <Button variant="gold" className="mt-4" onClick={() => completeMission(mission.id)}>
              Mark mission complete
            </Button>
          ) : (
            <Button variant="gold" className="mt-4" onClick={() => approveMission(mission.id)}>
              Simulate approval (demo)
            </Button>
          )}
        </Card>
      ) : (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Submit your mission evidence</CardTitle>
          </CardHeader>

          {state === 'available' ? (
            <Button
              variant="primary"
              className="mb-6"
              onClick={() => {
                startMission(mission.id)
                trackMissionStart(mission.id, mission.sdgId)
              }}
            >
              Start mission
            </Button>
          ) : null}

          {(state === 'in_progress' || state === 'available') && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-primary-dark">
                  Upload photo
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-cream py-8 transition-colors hover:border-primary-green/40"
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Upload preview"
                      className="max-h-40 rounded-lg object-cover"
                    />
                  ) : (
                    <>
                      <Upload className="size-8 text-sage" />
                      <span className="text-sm text-sage">
                        Click to upload photo evidence
                      </span>
                    </>
                  )}
                </button>
                {photoName ? (
                  <p className="mt-1 text-xs text-sage">{photoName}</p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="mission-notes"
                  className="mb-2 block text-sm font-medium text-primary-dark"
                >
                  Field notes
                </label>
                <textarea
                  id="mission-notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe what you did, what you observed, and your estimated impact..."
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-primary-dark placeholder:text-sage focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/20"
                />
              </div>

              {showConfirmation ? (
                <div className="rounded-lg border border-primary-green/30 bg-primary-green/10 p-4 text-center">
                  <CheckCircle2 className="mx-auto mb-2 size-8 text-primary-green" />
                  <p className="font-medium text-primary-dark">Submission confirmed!</p>
                  <p className="mt-1 text-sm text-sage">
                    Your evidence has been saved locally. Awaiting review.
                  </p>
                  <Button variant="gold" className="mt-4" onClick={handleApproveAndComplete}>
                    Demo: Approve & complete
                  </Button>
                </div>
              ) : (
                <Button
                  variant="gold"
                  disabled={!notes.trim() || state === 'available'}
                  onClick={handleSubmit}
                >
                  Submit mission
                </Button>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      {children}
    </Card>
  )
}

function RewardPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gold/30 bg-gold/10 px-4 py-2">
      <p className="text-xs text-sage">{label}</p>
      <p className="font-semibold text-primary-dark">{value}</p>
    </div>
  )
}

function StateBadge({ state }: { state: MissionState }) {
  const styles: Record<MissionState, string> = {
    locked: 'bg-sage/20 text-sage',
    available: 'bg-primary-green/15 text-primary-green',
    in_progress: 'bg-gold/15 text-gold',
    submitted: 'bg-gold/15 text-gold',
    approved: 'bg-primary-green/15 text-primary-green',
    completed: 'bg-primary-green/15 text-primary-green',
  }
  return (
    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', styles[state])}>
      {missionStateLabels[state]}
    </span>
  )
}
