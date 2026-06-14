import type { DailyChallengeDefinition } from '@/types/gamification'

export const dailyChallengeDefinitions: DailyChallengeDefinition[] = [
  {
    id: 'daily_lesson',
    title: 'Daily Lesson Challenge',
    description: 'Complete any lesson today to keep your learning streak going.',
    eventType: 'lesson_complete',
    target: 1,
    xpReward: 30,
    ecoCoinReward: 15,
  },
  {
    id: 'daily_quiz',
    title: 'Daily Quiz Challenge',
    description: 'Finish a quiz today to earn extra EcoCoins and XP.',
    eventType: 'quiz_complete',
    target: 1,
    xpReward: 40,
    ecoCoinReward: 20,
  },
  {
    id: 'daily_mission',
    title: 'Daily Mission Challenge',
    description: 'Submit a mission today to power your impact streak.',
    eventType: 'mission_complete',
    target: 1,
    xpReward: 50,
    ecoCoinReward: 30,
  },
]
