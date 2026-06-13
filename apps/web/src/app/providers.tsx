import type { ReactNode } from 'react'
import { LessonProgressProvider } from '@/context/LessonProgressContext'
import { MissionProgressProvider } from '@/context/MissionProgressContext'
import { QuizProgressProvider } from '@/context/QuizProgressContext'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <LessonProgressProvider>
      <QuizProgressProvider>
        <MissionProgressProvider>{children}</MissionProgressProvider>
      </QuizProgressProvider>
    </LessonProgressProvider>
  )
}
