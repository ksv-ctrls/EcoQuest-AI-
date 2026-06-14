import type { ReactNode } from 'react'
import { LessonProgressProvider } from '@/context/LessonProgressContext'
import { MissionProgressProvider } from '@/context/MissionProgressContext'
import { QuizProgressProvider } from '@/context/QuizProgressContext'
import { UserProfileProvider } from '@/context/UserProfileContext'
import { GamificationProvider } from '@/context/GamificationContext'
import { GameProgressProvider } from '@/games/context/GameProgressContext'
import { RecommendationProvider } from '@/recommendation/RecommendationContext'
import { AiTutorProvider } from '@/ai/context/AiTutorContext'
import { ImpactProvider } from '@/impact/context/ImpactContext'
import { AuthProvider } from '@/context/AuthContext'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <UserProfileProvider>
        <GamificationProvider>
          <GameProgressProvider>
            <LessonProgressProvider>
              <QuizProgressProvider>
                <MissionProgressProvider>
                  <RecommendationProvider>
                    <AiTutorProvider>
                      <ImpactProvider>{children}</ImpactProvider>
                    </AiTutorProvider>
                  </RecommendationProvider>
                </MissionProgressProvider>
              </QuizProgressProvider>
            </LessonProgressProvider>
          </GameProgressProvider>
        </GamificationProvider>
      </UserProfileProvider>
    </AuthProvider>
  )
}
