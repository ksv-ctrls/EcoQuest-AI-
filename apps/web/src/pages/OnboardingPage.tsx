import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { useUserProfile } from '@/context/UserProfileContext'
import { useAuth } from '@/context/AuthContext'
import { mockSdgGoals } from '@/data/mock/sdg'
import type { EducationLevel, LearningStyle, PersonalityType, SustainabilityHabit } from '@/types/user'

const educationOptions: Array<{ value: EducationLevel; label: string }> = [
  { value: 'primary', label: 'Primary school' },
  { value: 'secondary', label: 'Secondary school' },
  { value: 'high_school', label: 'High school' },
  { value: 'college', label: 'College / university' },
  { value: 'other', label: 'Other / adult learner' },
]

const learningStyles: Array<{ value: LearningStyle; label: string }> = [
  { value: 'visual', label: 'Visual' },
  { value: 'interactive', label: 'Interactive' },
  { value: 'reading', label: 'Reading' },
  { value: 'video', label: 'Video' },
]

const personalityOptions: Array<{ value: PersonalityType; label: string; description: string }> = [
  {
    value: 'explorer',
    label: 'Explorer',
    description: 'I love discovering new ideas and trying new challenges.',
  },
  {
    value: 'competitive',
    label: 'Competitive',
    description: 'I like testing myself and comparing progress.',
  },
  {
    value: 'creative',
    label: 'Creative',
    description: 'I enjoy building and experimenting with new solutions.',
  },
  {
    value: 'social',
    label: 'Social',
    description: 'I learn best with friends and shared challenges.',
  },
]

const habitOptions: Array<{ value: SustainabilityHabit; label: string }> = [
  { value: 'recycling', label: 'Recycling' },
  { value: 'water_conservation', label: 'Water conservation' },
  { value: 'energy_saving', label: 'Energy saving' },
  { value: 'public_transport', label: 'Public transport' },
  { value: 'waste_segregation', label: 'Waste segregation' },
]

export function OnboardingPage() {
  const navigate = useNavigate()
  const { hasProfile, saveProfile } = useUserProfile()
  const { user } = useAuth()

  const [step, setStep] = useState(1)
  const [displayName, setDisplayName] = useState(user?.name || '')
  const [age, setAge] = useState('')
  const [education, setEducation] = useState<EducationLevel>('secondary')
  const [learningStyle, setLearningStyle] = useState<LearningStyle | ''>('')
  const [personalityType, setPersonalityType] = useState<PersonalityType | ''>('')
  const [impactAreas, setImpactAreas] = useState<string[]>([])
  const [sustainabilityHabits, setSustainabilityHabits] = useState<
    SustainabilityHabit[]
  >([])

  const isStepOneValid = displayName.trim().length > 0 && Number(age) > 0 && education
  const isStepTwoValid = learningStyle !== ''
  const isStepThreeValid = personalityType !== '' && impactAreas.length > 0
  const isStepFourValid = sustainabilityHabits.length > 0

  const selectedSdgLabels = useMemo(
    () => impactAreas.map((id) => mockSdgGoals.find((goal) => goal.id === id)?.title ?? id),
    [impactAreas],
  )

  if (hasProfile) {
    return <Navigate to="/dashboard" replace />
  }

  const handleToggleImpactArea = (id: string) => {
    setImpactAreas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const handleToggleHabit = (value: SustainabilityHabit) => {
    setSustainabilityHabits((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    )
  }

  const handleSubmit = () => {
    if (!isStepFourValid) return
    saveProfile({
      displayName: displayName.trim(),
      fullName: displayName.trim(),
      age: Number(age),
      education,
      learningStyle: learningStyle as LearningStyle,
      personalityType: personalityType as PersonalityType,
      impactAreas,
      sustainabilityHabits,
    })
    navigate('/dashboard')
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-primary-dark">Welcome to EcoQuest!</h1>
        <p className="max-w-2xl text-sm text-sage">
          Help us personalize your learning journey by sharing your interests, study habits, and sustainability focus.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card variant="elevated" className="space-y-6">
          <CardHeader>
            <CardTitle>Step {step} of 4</CardTitle>
            <CardDescription>
              {step === 1 && 'Tell us about you.'}
              {step === 2 && 'Pick your favorite learning style.'}
              {step === 3 && 'Choose a personality and impact areas.'}
              {step === 4 && 'Share your daily sustainability habits.'}
            </CardDescription>
          </CardHeader>

          {step === 1 && (
            <div className="space-y-5">
              <label className="block text-sm font-medium text-primary-dark">
                Display name
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-cream px-4 py-3 text-sm text-primary-dark outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20"
                />
              </label>

              <label className="block text-sm font-medium text-primary-dark">
                Age
                <input
                  type="number"
                  min={7}
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-cream px-4 py-3 text-sm text-primary-dark outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20"
                />
              </label>

              <label className="block text-sm font-medium text-primary-dark">
                Education
                <select
                  value={education}
                  onChange={(event) => setEducation(event.target.value as EducationLevel)}
                  className="mt-2 w-full rounded-xl border border-border bg-cream px-4 py-3 text-sm text-primary-dark outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20"
                >
                  {educationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {learningStyles.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`rounded-3xl border px-4 py-5 text-left transition ${
                    learningStyle === option.value
                      ? 'border-primary-green bg-primary-green/10 text-primary-dark'
                      : 'border-border bg-cream text-primary-dark hover:border-primary-green/50'
                  }`}
                  onClick={() => setLearningStyle(option.value)}
                >
                  <p className="font-semibold">{option.label}</p>
                  <p className="mt-2 text-sm text-sage">
                    {option.label === 'Visual' && 'Learn with images, graphs and guided diagrams.'}
                    {option.label === 'Interactive' && 'Prefer games, experiments and quick actions.'}
                    {option.label === 'Reading' && 'Enjoy text, articles and guided notes.'}
                    {option.label === 'Video' && 'Like videos, animations and story-led lessons.'}
                  </p>
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {personalityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`rounded-3xl border p-5 text-left transition ${
                      personalityType === option.value
                        ? 'border-primary-green bg-primary-green/10 text-primary-dark'
                        : 'border-border bg-cream text-primary-dark hover:border-primary-green/50'
                    }`}
                    onClick={() => setPersonalityType(option.value)}
                  >
                    <p className="font-semibold">{option.label}</p>
                    <p className="mt-2 text-sm text-sage">{option.description}</p>
                  </button>
                ))}
              </div>

              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-sage">
                  Preferred impact areas
                </h2>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {mockSdgGoals.map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      className={`rounded-3xl border p-4 text-left transition ${
                        impactAreas.includes(goal.id)
                          ? 'border-primary-green bg-primary-green/10 text-primary-dark'
                          : 'border-border bg-cream text-primary-dark hover:border-primary-green/50'
                      }`}
                      onClick={() => handleToggleImpactArea(goal.id)}
                    >
                      <p className="font-semibold">{goal.number}. {goal.title}</p>
                      <p className="mt-1 text-sm text-sage">{goal.shortDescription}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-sage">
                  Daily sustainability habits
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {habitOptions.map((habit) => (
                    <button
                      key={habit.value}
                      type="button"
                      className={`rounded-3xl border p-4 text-left transition ${
                        sustainabilityHabits.includes(habit.value)
                          ? 'border-primary-green bg-primary-green/10 text-primary-dark'
                          : 'border-border bg-cream text-primary-dark hover:border-primary-green/50'
                      }`}
                      onClick={() => handleToggleHabit(habit.value)}
                    >
                      <p className="font-semibold">{habit.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-primary-dark/5 p-5 text-sm text-sage">
                <p className="font-semibold text-primary-dark">Quick preview</p>
                <p className="mt-2">Your profile will recommend a learning path based on how you like to learn, your favorite SDGs, and the habits you already practice.</p>
                <p className="mt-3">Selected SDGs: {selectedSdgLabels.join(', ') || 'None selected yet'}</p>
                <p className="mt-1">Habits: {sustainabilityHabits.map((habit) => habitOptions.find((item) => item.value === habit)?.label).join(', ') || 'None selected yet'}</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {step > 1 ? (
              <Button
                variant="secondary"
                onClick={() => setStep((current) => current - 1)}
              >
                Back
              </Button>
            ) : null}
            {step < 4 ? (
              <Button
                onClick={() => {
                  if (step === 1 && isStepOneValid) setStep(2)
                  if (step === 2 && isStepTwoValid) setStep(3)
                  if (step === 3 && isStepThreeValid) setStep(4)
                }}
                disabled={
                  (step === 1 && !isStepOneValid) ||
                  (step === 2 && !isStepTwoValid) ||
                  (step === 3 && !isStepThreeValid)
                }
              >
                Continue
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!isStepFourValid}>
                Finish onboarding
              </Button>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why this matters</CardTitle>
            <CardDescription>
              Your answers create a personalized Eco Profile that shapes learning paths, suggested SDGs, and mission recommendations.
            </CardDescription>
          </CardHeader>

          <div className="space-y-4 text-sm text-sage">
            <p>
              We use your learning style to choose content formats that fit how you learn best.
            </p>
            <p>
              Your personality type helps us suggest the right balance of missions, quizzes, projects, and social challenges.
            </p>
            <p>
              Impact areas and habits let EcoQuest recommend SDGs where you can make the biggest difference.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
