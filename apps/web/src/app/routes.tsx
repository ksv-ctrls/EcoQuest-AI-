import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/pages/DashboardPage'
import { LessonReaderPage } from '@/pages/LessonReaderPage'
import { LessonsCatalogPage } from '@/pages/LessonsCatalogPage'
import { MissionCatalogPage } from '@/pages/MissionCatalogPage'
import { MissionDetailPage } from '@/pages/MissionDetailPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { QuizCatalogPage } from '@/pages/QuizCatalogPage'
import { QuizSessionRoutePage } from '@/pages/QuizSessionRoutePage'
import { SDGExplorerPage } from '@/pages/SDGExplorerPage'
import { SDGLessonsPage } from '@/pages/SDGLessonsPage'
import { SDGMissionsPage } from '@/pages/SDGMissionsPage'
import { SDGQuizzesPage } from '@/pages/SDGQuizzesPage'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/sdg" element={<SDGExplorerPage />} />
          <Route path="/sdg/:goalId" element={<SDGExplorerPage />} />
          <Route path="/lessons" element={<LessonsCatalogPage />} />
          <Route path="/lessons/:sdgId" element={<SDGLessonsPage />} />
          <Route path="/lessons/:sdgId/:lessonId" element={<LessonReaderPage />} />
          <Route path="/quizzes" element={<QuizCatalogPage />} />
          <Route path="/quizzes/:sdgId" element={<SDGQuizzesPage />} />
          <Route path="/quizzes/:sdgId/:quizId" element={<QuizSessionRoutePage />} />
          <Route path="/missions" element={<MissionCatalogPage />} />
          <Route path="/missions/:sdgId" element={<SDGMissionsPage />} />
          <Route path="/missions/:sdgId/:missionId" element={<MissionDetailPage />} />
          <Route path="/games" element={<PlaceholderPage />} />
          <Route path="/tutor" element={<PlaceholderPage />} />
          <Route path="/profile" element={<PlaceholderPage />} />
          <Route path="*" element={<PlaceholderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
