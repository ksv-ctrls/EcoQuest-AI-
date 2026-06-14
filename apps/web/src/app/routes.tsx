import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/pages/DashboardPage'
import { LessonReaderPage } from '@/pages/LessonReaderPage'
import { LessonsCatalogPage } from '@/pages/LessonsCatalogPage'
import { MissionCatalogPage } from '@/pages/MissionCatalogPage'
import { MissionDetailPage } from '@/pages/MissionDetailPage'
import { OnboardingPage } from '@/pages/OnboardingPage'
import { LoginPage } from '@/pages/LoginPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { RegisterPage } from '@/pages/RegisterPage'
import { QuizCatalogPage } from '@/pages/QuizCatalogPage'
import { QuizSessionRoutePage } from '@/pages/QuizSessionRoutePage'
import { SDGExplorerPage } from '@/pages/SDGExplorerPage'
import { SDGLessonsPage } from '@/pages/SDGLessonsPage'
import { SDGMissionsPage } from '@/pages/SDGMissionsPage'
import { SDGQuizzesPage } from '@/pages/SDGQuizzesPage'
import { AchievementsPage } from '@/pages/AchievementsPage'
import { RewardsPage } from '@/pages/RewardsPage'
import { GamesCatalogPage } from '@/pages/GamesCatalogPage'
import { GamePlayPage } from '@/games/pages/GamePlayPage'
import { AiTutorPage } from '@/ai/pages/AiTutorPage'
import { ImpactDashboardPage } from '@/impact/pages/ImpactDashboardPage'
import { ImpactReportPage } from '@/impact/pages/ImpactReportPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { useUserProfile } from '@/context/UserProfileContext'
import { useAuth } from '@/context/AuthContext'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

function RequireProfile({ children }: { children: React.ReactNode }) {
  const { hasProfile } = useUserProfile()
  const location = useLocation()

  if (!hasProfile && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  return <>{children}</>
}

function RedirectIfProfile({ children }: { children: React.ReactNode }) {
  const { hasProfile } = useUserProfile()

  if (hasProfile) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<RedirectIfProfile><OnboardingPage /></RedirectIfProfile>} />

        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<RequireAuth><RequireProfile><DashboardPage /></RequireProfile></RequireAuth>} />
          <Route path="/sdg" element={<RequireAuth><RequireProfile><SDGExplorerPage /></RequireProfile></RequireAuth>} />
          <Route path="/sdg/:goalId" element={<RequireAuth><RequireProfile><SDGExplorerPage /></RequireProfile></RequireAuth>} />
          <Route path="/lessons" element={<RequireAuth><RequireProfile><LessonsCatalogPage /></RequireProfile></RequireAuth>} />
          <Route path="/lessons/:sdgId" element={<RequireAuth><RequireProfile><SDGLessonsPage /></RequireProfile></RequireAuth>} />
          <Route path="/lessons/:sdgId/:lessonId" element={<RequireAuth><RequireProfile><LessonReaderPage /></RequireProfile></RequireAuth>} />
          <Route path="/quizzes" element={<RequireAuth><RequireProfile><QuizCatalogPage /></RequireProfile></RequireAuth>} />
          <Route path="/quizzes/:sdgId" element={<RequireAuth><RequireProfile><SDGQuizzesPage /></RequireProfile></RequireAuth>} />
          <Route path="/quizzes/:sdgId/:quizId" element={<RequireAuth><RequireProfile><QuizSessionRoutePage /></RequireProfile></RequireAuth>} />
          <Route path="/missions" element={<RequireAuth><RequireProfile><MissionCatalogPage /></RequireProfile></RequireAuth>} />
          <Route path="/missions/:sdgId" element={<RequireAuth><RequireProfile><SDGMissionsPage /></RequireProfile></RequireAuth>} />
          <Route path="/missions/:sdgId/:missionId" element={<RequireAuth><RequireProfile><MissionDetailPage /></RequireProfile></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><RequireProfile><ProfilePage /></RequireProfile></RequireAuth>} />
          <Route path="/achievements" element={<RequireAuth><RequireProfile><AchievementsPage /></RequireProfile></RequireAuth>} />
          <Route path="/rewards" element={<RequireAuth><RequireProfile><RewardsPage /></RequireProfile></RequireAuth>} />
          <Route path="/games" element={<RequireAuth><RequireProfile><GamesCatalogPage /></RequireProfile></RequireAuth>} />
          <Route path="/games/:gameId" element={<RequireAuth><RequireProfile><GamePlayPage /></RequireProfile></RequireAuth>} />
          <Route path="/ai-tutor" element={<RequireAuth><RequireProfile><AiTutorPage /></RequireProfile></RequireAuth>} />
          <Route path="/impact" element={<RequireAuth><RequireProfile><ImpactDashboardPage /></RequireProfile></RequireAuth>} />
          <Route path="/impact/report" element={<RequireAuth><RequireProfile><ImpactReportPage /></RequireProfile></RequireAuth>} />
          <Route path="/tutor" element={<Navigate to="/ai-tutor" replace />} />
          <Route path="*" element={<RequireAuth><RequireProfile><PlaceholderPage /></RequireProfile></RequireAuth>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
